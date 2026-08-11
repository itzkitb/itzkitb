const MAX_HISTORY = 180;
let charts = {};
let uptimeDataCache = null;
let historyData = {
	labels: [],
	cpu: [],
	ram: [],
	redisOps: [],
	commandsPm: [],
	redisKeys: [],
	messagesPm: []
};

function loadScript(src) {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) return resolve();
		const s = document.createElement('script');
		s.src = src;
		s.onload = resolve;
		s.onerror = reject;
		document.head.appendChild(s);
	});
}

function getCanvas(containerId) {
	const container = document.getElementById(containerId);
	if (!container) return null;
	container.innerHTML = '<canvas></canvas>';
	return container.querySelector('canvas');
}

function formatBytes(bytes) {
	if (!bytes || bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTimeSpan(timeStr) {
	if (!timeStr) return '0s';
	const parts = timeStr.split('.');
	let d = 0, hms = timeStr;
	if (parts.length > 1 && !timeStr.startsWith("0.")) {
		d = parts[0];
		hms = parts[1];
	}
	const hmsParts = hms.split(':');
	if (hmsParts.length >= 2) {
		return `${d ? d + 'd ' : ''}${hmsParts[0]}h ${hmsParts[1]}m`;
	}
	return timeStr;
}

function renderUptimeBar(uptimeData) {
	if (uptimeData) uptimeDataCache = uptimeData;
	if (!uptimeDataCache) return;

	const container = document.getElementById('uptime_bar_container');
	const percentLabel = document.getElementById('val_uptime_percent');
	const labelStart = document.getElementById('uptime_label_start');
	if (!container) return;

	container.innerHTML = '';

	const isMobile = window.innerWidth <= 600;
	const hoursToDisplay = isMobile ? 72 : 168;
	const displayData = uptimeDataCache.slice(-hoursToDisplay);

	if (labelStart) labelStart.textContent = isMobile ? '3 days ago' : '7 days ago';

	const TARGET_PINGS_PER_HOUR = 360;
	let totalPingsReceived = 0;
	let totalMaxPossiblePings = 0;

	const totalHours = displayData.length;
	const now = Date.now();

	displayData.forEach((item, index) => {
		const pings = item.pings || 0;
		totalPingsReceived += pings;

		const isLastSegment = (index === totalHours - 1);
		let targetPings = TARGET_PINGS_PER_HOUR;

		if (isLastSegment) {
			const elapsedMs = Math.max(0, now - item.timestamp);
			const elapsedSeconds = Math.floor(elapsedMs / 1000);
			targetPings = Math.max(1, Math.min(TARGET_PINGS_PER_HOUR, Math.floor(elapsedSeconds / 10)));
		}

		totalMaxPossiblePings += targetPings;

		const ratio = Math.min(1, Math.max(0, pings / targetPings));
		const hue = Math.round(ratio * 120);
		const lightness = Math.round(71 + ratio * 10);
		const barColor = `hsl(${hue}, 100%, ${lightness}%)`;

		const segment = document.createElement('div');
		segment.className = 'uptime-bar-segment';
		segment.style.backgroundColor = barColor;

		const dateStr = new Date(item.timestamp).toLocaleString('ru-RU', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});

		const statusText = pings > 0 ? (ratio >= 0.95 ? 'ONLINE' : 'PARTIAL') : 'OFFLINE';
		segment.setAttribute('data-tooltip', `${dateStr} | ${statusText} (${pings}/${targetPings})`);

		container.appendChild(segment);
	});

	if (percentLabel && totalMaxPossiblePings > 0) {
		const overallPercent = ((totalPingsReceived / totalMaxPossiblePings) * 100).toFixed(2);
		percentLabel.textContent = `${overallPercent}%`;
	}
}

function createChart(containerId, label, maxVal = null) {
	const canvas = getCanvas(containerId);
	if (!canvas) return null;

	return new Chart(canvas, {
		type: 'line',
		data: {
			labels: [],
			datasets: [{
				label: label,
				data: [],
				borderColor: '#A0FFA0',
				backgroundColor: 'rgba(160, 255, 160, 0.1)',
				borderWidth: 2,
				fill: true,
				tension: 0.2,
				pointBackgroundColor: '#A0FFA0',
				pointRadius: 0,
				borderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBackgroundColor: '#A0FFA0',
				pointHoverBorderColor: '#A0FFA0',
				pointHoverBorderWidth: 2,
				pointHitRadius: 25
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: { duration: 300 },
			interaction: {
				intersect: false,
				mode: 'index',
			},
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: 'rgba(20, 20, 20, 0.8)',
					titleFont: { size: 10 },
					bodyFont: { size: 13 },
					displayColors: false,
					padding: 10,
					cornerRadius: 4
				}
			},
			scales: {
				x: {
					grid: { color: 'rgba(160, 255, 160, 0.05)' },
					ticks: { color: '#ffffff80', font: { family: 'Montserrat', size: 10 } }
				},
				y: {
					min: 0,
					max: maxVal,
					grid: { color: 'rgba(160, 255, 160, 0.1)' },
					ticks: { color: '#a0ffa0', font: { family: 'Montserrat', size: 10 } }
				}
			}
		}
	});
}

function initCharts() {
	if (typeof Chart === 'undefined') return;
	Chart.defaults.font.family = 'Montserrat';

	charts.cpu = createChart('box_chart_cpu', 'cpu %', 100);
	charts.ram = createChart('box_chart_ram', 'ram %', 100);
	charts.redisOps = createChart('box_chart_redis_ops', 'ops/min');
	charts.commandsPm = createChart('box_chart_commands_pm', 'cmds/min');
	charts.redisKeys = createChart('box_chart_redis_keys', 'keys');
	charts.messagesPm = createChart('box_chart_messages_pm', 'msgs/min');
}

function updateChartData() {
	const updateSingle = (chart, dataArray) => {
		if (!chart) return;
		chart.data.labels = historyData.labels;
		chart.data.datasets[0].data = dataArray;
		chart.update();
	};

	updateSingle(charts.cpu, historyData.cpu);
	updateSingle(charts.ram, historyData.ram);
	updateSingle(charts.redisOps, historyData.redisOps);
	updateSingle(charts.commandsPm, historyData.commandsPm);
	updateSingle(charts.redisKeys, historyData.redisKeys);
	updateSingle(charts.messagesPm, historyData.messagesPm);
}

async function fetchStats() {
	try {
		const res = await fetch('https://api.tupid.lol/stats');
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();

		const statusContainer = document.getElementById('status_badge_container');
		const isOk = data.status === 'ok';
		statusContainer.innerHTML = `<span class="status-badge ${isOk ? 'status-ok' : 'status-fail'}">${data.status || 'UNKNOWN'}</span>`;

		if (Array.isArray(data.uptime)) {
			renderUptimeBar(data.uptime);
		}

		const lastDate = data.lastStatus ? new Date(data.lastStatus).toLocaleTimeString() : new Date().toLocaleTimeString();
		document.getElementById('last_update_text').textContent = `last updated at ${lastDate}`;

		const m = data.metrics || {};

		document.getElementById('val_redis_mem').textContent = formatBytes(m.redisMemoryUsedBytes);
		document.getElementById('val_session_uptime').textContent = formatTimeSpan(m.botSessionUptime);
		document.getElementById('val_total_uptime').textContent = formatTimeSpan(m.totalUptime);
		document.getElementById('val_total_commands').textContent = m.totalCommandsExecuted;

		const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

		if (historyData.labels.length >= MAX_HISTORY) {
			historyData.labels.shift();
			historyData.cpu.shift();
			historyData.ram.shift();
			historyData.redisOps.shift();
			historyData.commandsPm.shift();
			historyData.redisKeys.shift();
			historyData.messagesPm.shift();
		}

		historyData.labels.push(timeLabel);
		historyData.cpu.push(m.cpuPercent ? parseFloat(m.cpuPercent.toFixed(1)) : 0);
		historyData.ram.push(m.ramPercent ? parseFloat(m.ramPercent.toFixed(1)) : 0);
		historyData.redisOps.push(m.redisOpsPerMinute || 0);
		historyData.commandsPm.push(m.commandsPerMinute || 0);
		historyData.redisKeys.push(m.redisTotalKeys);
		historyData.messagesPm.push(m.messagesPerMinute || 0);

		updateChartData();
	} catch (err) {
		console.error("failed to fetch stats:", err);
		const statusContainer = document.getElementById('status_badge_container');
		if (statusContainer) {
			statusContainer.innerHTML = `<span class="status-badge status-fail">OFFLINE / ERROR</span>`;
		}
	}
}

async function initStatusPage() {
	try {
		if (typeof Chart === 'undefined') {
			await loadScript('https://cdn.jsdelivr.net/npm/chart.js');
		}
		initCharts();
		await fetchStats();

		setInterval(fetchStats, 10000);
	} catch (e) {
		console.error("failed to initialize status page:", e);
	}
}

initStatusPage();
window.addEventListener('resize', () => renderUptimeBar());
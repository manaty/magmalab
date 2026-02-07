<script lang="ts">
  import { onMount } from 'svelte';
  import { scenario } from '$lib/stores/scenario';
  import * as d3 from 'd3';

  let temperatureContainer: HTMLDivElement;
  let pressureContainer: HTMLDivElement;

  // Format time for display
  function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(0)}m`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)}d`;
    return `${(seconds / 31536000).toFixed(1)}y`;
  }

  function drawChart(
    container: HTMLDivElement,
    points: [number, number][],
    yLabel: string,
    color: string
  ) {
    if (!container) return;

    // Clear previous
    d3.select(container).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 180 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xExtent = d3.extent(points, (d) => d[0]) as [number, number];
    const yExtent = d3.extent(points, (d) => d[1]) as [number, number];

    const x = d3.scaleLinear().domain(xExtent).range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, yExtent[0]), yExtent[1] * 1.1])
      .range([height, 0]);

    // Axes
    const xAxis = d3
      .axisBottom(x)
      .ticks(5)
      .tickFormat((d) => formatTime(d as number));

    const yAxis = d3.axisLeft(y).ticks(5);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .attr('color', '#78716c');

    svg.append('g').call(yAxis).attr('color', '#78716c');

    // Y-axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a8a29e')
      .attr('font-size', '12px')
      .text(yLabel);

    // X-axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a8a29e')
      .attr('font-size', '12px')
      .text('Time');

    // Line
    const line = d3
      .line<[number, number]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Points
    svg
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d[0]))
      .attr('cy', (d) => y(d[1]))
      .attr('r', 4)
      .attr('fill', color);
  }

  function updateCharts() {
    if (temperatureContainer) {
      drawChart(
        temperatureContainer,
        $scenario.path.T_points,
        'Temperature (C)',
        '#ef4444'
      );
    }
    if (pressureContainer) {
      drawChart(
        pressureContainer,
        $scenario.path.P_points,
        'Pressure (MPa)',
        '#3b82f6'
      );
    }
  }

  onMount(() => {
    updateCharts();
    // Re-draw on resize
    const resizeObserver = new ResizeObserver(() => updateCharts());
    resizeObserver.observe(temperatureContainer);
    return () => resizeObserver.disconnect();
  });

  // Re-draw when scenario changes
  $effect(() => {
    $scenario.path;
    updateCharts();
  });
</script>

<div class="space-y-4">
  <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
    <h3 class="text-sm font-medium text-stone-300 mb-3">Temperature vs Time</h3>
    <div bind:this={temperatureContainer} class="w-full"></div>
  </div>

  <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
    <h3 class="text-sm font-medium text-stone-300 mb-3">Pressure vs Time</h3>
    <div bind:this={pressureContainer} class="w-full"></div>
  </div>
</div>

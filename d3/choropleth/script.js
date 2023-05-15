const EDUCATION_DATA_URL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const COUNTY_DATA_URL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const svg = d3.select('#container').append('svg');
const tooltip = d3.select('#container').append('div').attr('id', 'tooltip').style('opacity', 0);

d3.json(EDUCATION_DATA_URL).then(educationData => {
  d3.json(COUNTY_DATA_URL).then(countyData => {
    const path = d3.geoPath();
    const colorScale = d3.scaleThreshold()
      .domain([3, 12, 21, 30, 39, 48, 57, 66])
      .range(d3.schemeBlues[9]);

    svg.attr('viewBox', [0, 0, 975, 610])
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.append('g')
      .selectAll('path')
      .data(topojson.feature(countyData, countyData.objects.counties).features)
      .join('path')
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('data-education', d => {
          const county = educationData.find(e => e.fips === d.id);
          return county ? county.bachelorsOrHigher : 0;
        })
        .attr('fill', d => {
          const county = educationData.find(e => e.fips === d.id);
          return county ? colorScale(county.bachelorsOrHigher) : colorScale(0);
        })
        .attr('d', path)
        .on('mouseover', (event, d) => {
          const county = educationData.find(e => e.fips === d.id);
          tooltip.style('opacity', 1)
            .attr('data-education', county ? county.bachelorsOrHigher : 0)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 30 + 'px')
            .html(() => {
              if (county) {
                return county.area_name + ', ' + county.state + ': ' + county.bachelorsOrHigher + '%';
              }
              return 'No data available';
            });
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });

    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', 'translate(0, 40)');

    const legendWidth = 300;
    const legendHeight = 8;

    const legendScale = d3.scaleLinear()
      .domain([2.6, 75.1])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .tickSize(legendHeight)
      .tickFormat(d => d + '%')
      .tickValues(colorScale.domain());

    legend.append('g')
      .selectAll('rect')
      .data(colorScale.range().map(d => {
        d = colorScale.invertExtent(d);
        if (d[0] == null) d[0] = legendScale.domain()[0];
        if (d[1] == null) d[1] = legendScale.domain()[1];
        return d;
      }))
      .join('rect')
        .attr('height', legendHeight)
        .attr('x', d => legendScale(d[0]))
        .attr('width', d => legendScale(d[1]) - legendScale(d[0]))
        .attr('fill', d => colorScale(d[0]));

    legend.append('g')
      .call(legendAxis)
      .select('.domain')
        .remove();
  });
});

    
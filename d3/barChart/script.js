const projectName = "bar-chart";

const width = 800;
const height = 400;
const barWidth = width / 275;

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((data) => {
    console.log("🚀 ~ file: script.js ~ line 11 ~ data", data);
  })
  .catch((e) => console.log("❗️ Error: ", e.message));

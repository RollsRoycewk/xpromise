const fs = require("fs");
const path = require("path");

const json2md = require("json2md");
const dataFile = path.resolve(__dirname, "../", "README.MD");

const md = [
	{ h1: "Github最近流行仓库～" },
	{
		table: {
			headers: ["名称", "描述", "作者", "star量"],
			rows: [],
		},
	},
];

const crawlerGithubTrendingData = require("./crawler");

crawlerGithubTrendingData()
	.then((trendingData) => {
		md[1].table.rows = trendingData.map(({ author, name, desc, star, url }) => {
			return [{ link: { title: name, source: url } }, desc, author, star];
		});

		fs.writeFileSync(dataFile, json2md(md));
	})
	.catch((err) => {
		console.log(err);
	});

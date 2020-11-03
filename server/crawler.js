const rp = require("request-promise-native");
const cheerio = require("cheerio");

module.exports = function crawlerGithubTrendingData() {
	return rp("https://github.com/trending/javascript?since=daily")
		.then((res) => {
			// 爬取数据
			const $ = cheerio.load(res);

			const trendingRepos = [];

			const rows = $("article.Box-row");

			for (let i = 0; i < rows.length; i++) {
				const row = $(rows[i]);

				const a = row.find("a");
				const [author, name] = a.text().replace(/\s/g, "").split("/");
				const url = a.attr("href");

				const p = row.find("p");
				const desc = p ? p.text().trim() : "暂无描述";

				const star = $(row.find(".muted-link")[0]).text().trim();

				trendingRepos.push({
					author, // 作者
					name, // 仓库名称
					desc, // 描述
					star, // 星星数量
					url,
				});
			}

			return trendingRepos;
		})
		.then((trendingRepos) => {
			// 判断是否需要格式化数据
			let needFormat = false;
			const first = trendingRepos[0];
			if (first.author.startsWith("Star") && first.url.startsWith("/login?"))
				needFormat = true;

			if (!needFormat) return trendingRepos;

			// 格式化数据
			const formatData = trendingRepos.map((repo) => {
				let { url } = repo;

				const [author, name] = url.slice(19).split("%2");
				url = `https://github.com${url.slice(17)}`;

				return {
					...repo,
					name,
					url,
					author,
				};
			});

			return formatData;
		})
		.catch((err) => {
			console.log(err);
		});
};

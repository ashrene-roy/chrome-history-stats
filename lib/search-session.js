import treeify from 'treeify';
import * as fileUtils from './utils/file.util.js';
import { AppDAO } from './dao/AppDAO.js';
import { getHistoryTree } from './history-tree.js';
import { KeywordRepository } from './repository/KeywordRepository.js';

const getSearchSessionsForKeyword = async () => {
  const searchKeyword = process.argv[2];
  const dao = new AppDAO(await fileUtils.copyDBFile());
  const keywordRepository = new KeywordRepository(dao);
  const keyword = await keywordRepository.getAllKeywordAndVisitLikeKeyword(searchKeyword);
  const uniqueVisits = await getHistoryTree();
  await dao.end();

  keyword.forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    element.uniqueVisit = uniqueVisits[element.id];
  });
  return keyword;
};

getSearchSessionsForKeyword().then((keyword) => {
  keyword.forEach((element) => {
    console.log(`Keyword: ${element.term}\n${'='.repeat(100)}`);
    console.log(treeify.asTree(element.uniqueVisit));
  });
});

export { getSearchSessionsForKeyword };

import { useState } from "react";
import octokit from "../Utils/octokit";

const SearchBar = props => {
    const { repoList, setRepo } = props;
    const [searchTerm, setSearchTerm] = useState("");
    const [repositoryList, setRepositoryList] = useState([]);
    const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false);

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const fetchRepositories = async (repoName) =>
        await octokit
            .request("GET /search/repositories", {
                q: repoName,
            })
            .then((resp) => {
                setRepositoryList(resp.data.items.slice(0, 5));
            });

    const onClickSearch = () => {
        if (searchTerm.length > 0) {
            fetchRepositories(searchTerm);
            setIsSearchResultsVisible(true);
        }
    };

    const onClickAddRepo = (newRepo) => {
        setRepo([...repoList, newRepo]);
        setIsSearchResultsVisible(false);
        setRepositoryList([]);
    };

    return (
        <div className="flex justify-center flex-wrap">
            <div className="sm:w-full md:w-1/2 p-4">
                <input
                    type="text"
                    name="searchterm"
                    className="w-full py-2 border-solid border-2 border-gray-600 rounded"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                {isSearchResultsVisible &&
                    repositoryList.map((repo) => (
                        <div
                            key={repo.id}
                            className="flex p-4 border-solid border-2 border-black rounded"
                        >
                            <div className="w-10/12 flex-col px-2">
                                <div className="flex flex-row">
                                    <span className="font-semibold">
                                        {repo.name}: {repo.full_name}
                                    </span>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        className="w-1/12 px-2 hover:text-blue-800"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </div>
                                <span>Description: {repo.description}</span>
                            </div>
                            <div className="w-2/12 px-2">
                                <button
                                    className="w-full bg-blue-500 hover:bg-transparent text-white font-semibold hover:text-blue-500
                                    py-2 px-4 border border-white hover:border-blue-500 rounded"
                                    onClick={() => onClickAddRepo(repo)}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="sm:w-1/2 md:w-1/3 lg:w-2/12 p-4">
                <button
                    className="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white
                py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    onClick={onClickSearch}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;

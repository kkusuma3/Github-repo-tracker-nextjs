import { useState, useEffect } from "react";
import octokit from "../Utils/octokit";
import moment from "moment";

const RepositoryCard = (props) => {
    const { repoDetails, repoList, setRepoList } = props;
    const [repo, setRepo] = useState(repoDetails);
    const [isMoreDetailsVisible, setIsMoreDetailsVisible] = useState(false);

    const fetchRepoDetails = async () =>
        await octokit
            .request(`GET /repos/${repo.owner.login}/${repo.name}/releases`)
            .then((resp) => {
                if (resp.data.length > 0) {
                    setRepo({
                        ...repo,
                        releaseName: resp.data[0].name,
                        releaseDate: resp.data[0].published_at,
                        releaseNotes: resp.data[0].body,
                    });
                } else {
                    setRepo({
                        ...repo,
                        releaseDate: 'Not Available',
                    });
                }
            });

    const onRepoClick = () => {
        setIsMoreDetailsVisible(!isMoreDetailsVisible);
        setRepo({
            ...repo,
            markedSeen: true
        });
    }

    const onClickDeleteRepo = (deletedRepo) => {
        setRepoList(repoList.filter((repo) => repo.id !== deletedRepo.id));
    };

    useEffect(() => {
        fetchRepoDetails();
    }, []);

    return (
        <div
            key={repo.id}
            className={`flex flex-col m-4 p-4 border-solid border-2 rounded shadow-lg ${repo.markedSeen ? "border-gray-200" : "border-black"}`}
        >
            <div
                className="flex flex-row flex-wrap cursor-pointer"
                onClick={onRepoClick}
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
                <div className="sm:w-1/3 lg:w-2/12 p-2">
                    <button
                        className="w-full bg-red-700 hover:bg-transparent text-white font-semibold hover:text-red-500
                    py-2 px-4 border border-white hover:border-red-500 rounded"
                        onClick={() => onClickDeleteRepo(repo)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {isMoreDetailsVisible && (
                <div className="flex flex-col p-2">
                    <span className="font-semibold">
                        Last Release:
                    </span>
                    <span>{repo.releaseName || "Release"} - {moment(repo.releaseDate).format('MMMM Do YYYY')}</span>
                    <span className="font-semibold">Release Notes: </span>
                    <p>{repo.releaseNotes || "Not available"}</p>
                </div>
            )}
        </div>
    );
};

export default RepositoryCard;

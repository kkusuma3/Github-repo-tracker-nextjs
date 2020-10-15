import { useEffect, useState } from "react";
import Nav from "../components/nav";
import SearchBar from "../components/searchBar";
import RepositoryCard from "../components/repositoryCard";

export default function IndexPage() {
    const [savedRepoList, setSavedRepoList] = useState([]);
    
    useEffect(() => {
        if (localStorage.getItem('repoList') != undefined) {
            setSavedRepoList(JSON.parse(localStorage.getItem('repoList'))); 
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('repoList', JSON.stringify(savedRepoList));
    }, [savedRepoList]);

    return (
        <div>
            <Nav />
            <div className="py-10">
                <h1 className="text-5xl text-center text-accent-1">
                    GitHub Repository Tracker
                </h1>
            </div>
            <SearchBar repoList={savedRepoList} setRepo={setSavedRepoList} />
            <div className="p-20">
                <h1 className="text-3xl text-accent-1 font-light px-10">
                    Saved Repositories
                </h1>
                {savedRepoList.length > 0 &&
                    savedRepoList.map((repo) => (
                        <RepositoryCard
                            key={repo.id}
                            repoDetails={repo}
                            repoList={savedRepoList}
                            setRepoList={setSavedRepoList}
                        />
                    ))}
            </div>
        </div>
    );
}

import axios from "axios";

const token = process.env.REACT_APP_API_TOKEN;

const fetcher = url => {
    return axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    ).then(res => res.data)
}
const fetcherWatchlist = url => {
    return axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    ).then(res => res.data).catch((err) => {
        const offlineList = localStorage.getItem("watched");
        const translatedOfflineData = offlineList ? JSON.parse(offlineList) : [];
        return { results: translatedOfflineData };
    })
}

export { fetcher, fetcherWatchlist };

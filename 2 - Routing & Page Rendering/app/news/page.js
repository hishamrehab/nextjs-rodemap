import Link from "next/link";

export default function NewsPage() {
    return <>
    <h1>News Page</h1>
    <ul>
        <li>
            <Link  to="/news/first-news">First News Item</Link>
        </li>
      
         <li>
            <Link  to="/news/second-news">First News Item</Link>
        </li>

           <li>
            <Link  to="/news/third-news">Third News Item</Link>
        </li>

    </ul>
    </>
}
import { DUMMY_NEWS } from "@/dummy-news";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ImagePage({params}) {
    const newsItemSlug = params.slug;
    const newsItem = DUMMY_NEWS.find(newsItem => newsItem.slug === newsItemSlug);

    if(!newsItem) {
        notFound();
    }

    return (
        <div className="fullscreen-image">
       <Link href={`/news/${newsItem.slug}/image`}>
         <img
        src={`/images/news/${newsItem.image}`} 
        alt={newsItem.title}
        />
       </Link>

      </div>
    )
}
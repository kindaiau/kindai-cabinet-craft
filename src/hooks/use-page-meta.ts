import { useEffect } from "react";

interface PageMetaInput {
  title: string;
  description: string;
}

export function usePageMeta({ title, description }: PageMetaInput) {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (key: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`;
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (isProperty) el.setAttribute("property", key);
        else el.setAttribute("name", key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    ensureMeta("description", description);
    ensureMeta("og:title", title, true);
    ensureMeta("og:description", description, true);
    ensureMeta("twitter:title", title);
    ensureMeta("twitter:description", description);
  }, [title, description]);
}

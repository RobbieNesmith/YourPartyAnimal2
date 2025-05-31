import { ReactElement } from "react";
import "./ListItem.css";

export default function ListItem({imageUrl, title, children}: {imageUrl: string, title: string, children: ReactElement}) {
  return (
    <li className="queueItem">
      <img className="thumbnail" src={imageUrl} />
      <div className="centerContainer">
        <span>{title}</span>
      </div>
      { children }
    </li>
  );
}
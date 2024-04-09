import React from "react";
import { Link } from "react-router-dom";

interface PageCardProps {
  imageUrl: string;
  url: string;
  btnValue: string;
  content: string;
}

const PageCard: React.FC<PageCardProps> = ({content,btnValue, imageUrl, url }) => {
  return (
    // create a card with an image as background and a button
    // <Link
    //   to={url}
      // className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat w-72 h-72 shadow-lg hover:shadow-xl transition duration-300 ease-in-out rounded-4xl"
      // style={{ backgroundImage: `url(${imageUrl})` }}
    // >
      /* <div
        className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat w-72 h-72"
        style={{ backgroundImage: `url(${imageUrl})` }}
        
      >
      </div> */
  // </Link>
    <Link to={url}>
      <div className='cards'>
            <div className="container">
            <div className="parent card2">
                <div className="card" style={{backgroundImage: `url(${imageUrl})`}}>
                    <div className="content-box">
                        <h1 className="card-title">{btnValue}</h1>
                        <p className="card-content">
                            {content}
                        </p>
                        {/* <span className="see-more">Scrape</span> */}
                    </div>
                    </div>
                </div>
            </div>
        </div>
      </Link>
    
  );
};

export default PageCard;

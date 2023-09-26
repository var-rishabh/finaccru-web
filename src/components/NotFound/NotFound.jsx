import "./NotFound.css"

const NotFound = () => {
    return (
        <div className="notfound__container">
            <p className="notfound__text">
                404, page not found.
            </p>
            <a
                href="/"
                className="notfound__link">
                Go to home
            </a>
        </div>
    );
};

export default NotFound;

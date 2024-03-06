import './ViewHeader.css'

const ViewHeader = ({ title, logo }) => {
    return (
        <div className="view__header">
            <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                <img style={{ width: "max-content", height: "100%" }} src={logo} alt="logo" />
            </div>
            <h1 className='view__header--head'>{title}</h1>
        </div>
    )
}

export default ViewHeader

import type { DropdownType } from "./Types";

export default function Dropdown({
    items,
    selected,
    show,
    setShow,
    setSelected,
}: DropdownType) {
    return (
        <div>
            <div
                onClick={() => setShow(!show)}
                className={"relative flex flex-row p-1 justify-between items-center text-white text-center w-full border-b-1 border-blue-100"}
            >
                <h2>{items[selected]}</h2>
                {show ? <UpIcon /> : <DownIcon />}
            </div>
            {show && (
                <div className="flex flex-col text-white w-full bg-gray-800 rounded-b-lg max-h-30 overflow-y-auto">
                    {items.map((val, key) => {
                        return (
                            <h3
                                onClick={() => {
                                    setSelected(key);
                                    setShow(!show);
                                }}
                                className={
                                    "p-1 hover:bg-gray-900 " +
                                    (selected === key && "bg-gray-900")
                                }
                                key={key}
                            >
                                {val}
                            </h3>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function UpIcon() {
    return (
        <svg
            className="size-4 text-white fill-white rotate-180"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="122.88px"
            height="80.593px"
            viewBox="0 0 122.88 80.593"
            enableBackground="new 0 0 122.88 80.593"
            xmlSpace="preserve"
        >
            <g>
                <polygon points="122.88,0 122.88,30.82 61.44,80.593 0,30.82 0,0 61.44,49.772 122.88,0" />
            </g>
        </svg>
    );
}
function DownIcon() {
    return (
        <svg
            className="size-4 text-white fill-white"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="122.88px"
            height="80.593px"
            viewBox="0 0 122.88 80.593"
            enableBackground="new 0 0 122.88 80.593"
            xmlSpace="preserve"
        >
            <g>
                <polygon points="122.88,0 122.88,30.82 61.44,80.593 0,30.82 0,0 61.44,49.772 122.88,0" />
            </g>
        </svg>
    );
}

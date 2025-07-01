import { useEffect, useState } from "react"
import { type MapItemType } from "../components/Types";
import { NavLink, useLoaderData } from "react-router";

export default function MapPage() {
	const loaderParams = useLoaderData<MapItemType[] | null>();

	/** Fallback **/
	if (!loaderParams) {
		return (
            <div className="flex flex-column items-center justify-center h-dvh bg-slate-950">
                <div className="bg-white rounded-sm w-50% h-50% p-10 text-red-500 text-xl">
                    Failed to load problem sets, come back later
                </div>
            </div>
		)
	}

	return (
		<div className="relative flex flex-row w-full h-full items-start">
			<div className="relative flex-auto p-3 grid grid-flow-rows gap-3 grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))]" id="map">
			{loaderParams && loaderParams.length > 0 && loaderParams.map((val, key) => {
				return (
					<MapItem key={key} id={val.id} problemSetName={val.problemSetName} completed={val.completed}/>
				)
			})}
			</div>
		</div>
	)
}

function MapItem(item: MapItemType) {
	return (
		<div className={"relative flex flex-col p-2 items-center justify-center h-30 rounded-sm border-2 " + (item.completed ? "border-blue-300" : "border-white")}>
			<h3 className="text-white text-3xl">{item.problemSetName}</h3>
			<svg className={item.completed ? "fill-blue-300" : "fill-gray-300"} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.88px" height="116.864px" viewBox="0 0 122.88 116.864" enableBackground="new 0 0 122.88 116.864" xmlSpace="preserve"><g><polygon fillRule="evenodd" clipRule="evenodd" points="61.44,0 78.351,41.326 122.88,44.638 88.803,73.491 99.412,116.864 61.44,93.371 23.468,116.864 34.078,73.491 0,44.638 44.529,41.326 61.44,0"/></g></svg>
			<NavLink to={"/answer/" + item.id} className={"absolute inset-0 w-full h-full z-1 bg-transparent"}></NavLink>
		</div>
	)
}

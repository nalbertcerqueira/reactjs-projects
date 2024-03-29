import propTypes from "prop-types"
import { Children, cloneElement, useId, useState } from "react"

import LeftIcon from "../icons/menu/LeftIcon"

//Componente utilizado em Menu.jsx
export default function MenuTree({ children, className, icon, label }) {
    const [treeActive, setTreeActive] = useState(false)
    const tabIndex = treeActive ? 0 : -1
    const menuId = `${useId()}${label.toLowerCase()}`
    const childrenWithProps = Children.map(children, (child, index) => {
        return cloneElement(child, { tabIndex: tabIndex, key: index }, null)
    })

    return (
        <li className={`menu-tree ${treeActive ? "active" : ""}`}>
            <button
                aria-expanded={treeActive ? "true" : "false"}
                aria-controls={menuId}
                type="button"
                onClick={() => setTreeActive((prevState) => (prevState ? false : true))}
                className={`group/icon link ${className || ""}`}
            >
                <span className="ml-3">{icon}</span>
                <span className="block overflow-hidden">{label}</span>
                <span className="ml-auto">
                    <LeftIcon
                        stroke="icons"
                        className={`transition-all duration-200 ${treeActive ? "-rotate-90" : ""}`}
                    />
                </span>
            </button>
            <ul id={menuId}>{childrenWithProps}</ul>
        </li>
    )
}
MenuTree.propTypes = {
    className: propTypes.string,
    icon: propTypes.node,
    label: propTypes.string,
    children: propTypes.node
}

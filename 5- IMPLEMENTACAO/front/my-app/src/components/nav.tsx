import React from "react"

export const NavBar = () => {
    return (

        < div className="flex justify-between w-full h-14 bg-red-500 grid-cols-3" >
            <div className="w-64 h-full bg-black"></div>
            <div className="flex justify-center w-full h-14 bg-red-500 grid-cols-3 gap-5">
                <button type="button"><a href="/">Inicio</a></button>
                <button type="button"><a href="/users">Usuarios</a></button>
                <button type="button"><a href="/address">Endereços</a></button>
                <button type="button"><a href="/maquinario">Maquinario</a></button>
            </div>
            <div className="w-64 h-full bg-black"></div>
        </div >

    )
}
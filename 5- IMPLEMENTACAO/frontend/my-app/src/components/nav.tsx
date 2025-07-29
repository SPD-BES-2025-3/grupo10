import React from "react"

export const NavBar = () => {
    return (

        < div className="flex justify-between w-full h-14 bg-slate-800 grid-cols-3 fixed">
            <div className=""></div>
            <div className="flex justify-center w-full h-14 grid-cols-3 gap-5">
                <button type="button"><a href="/">Inicio</a></button>
                <button type="button"><a href="/maquinario">Maquinario</a></button>
                <button type="button"><a href="/estoque">Estoque</a></button>
                <button type="button"><a href="/manutencao">Manutenção</a></button>
                <button type="button"><a href="/responsavel">Responsaveis</a></button>
            </div>
            <div className=""></div>
        </div >

    )
}
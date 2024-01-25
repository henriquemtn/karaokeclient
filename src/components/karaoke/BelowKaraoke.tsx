interface CustomProps {
    music: string,
    artist: string,
    usuario: string,
}

export default function BelowKaraoke({ music, artist, usuario }: CustomProps) {
    return (
        <>
            <div className="flex justify-between items-center p-2 w-2/4 h-[101.75px] ">
                <div className="flex flex-col ">
                    <h1 className="text-white">{music}</h1>
                    <h1 className="text-[#424262]  font-medium">{artist}</h1>
                    <h1 className="text-white font-medium">{usuario}</h1>
                </div>
            </div>
        </>
    )
}
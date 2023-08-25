export default function DonutGraph({
    amount,
    totalAmount,
    fillColor,
    backgroundColor,
}: {
    amount: number
    totalAmount: number
    fillColor: string
    backgroundColor: string
}) {
    const percent = (amount / totalAmount) * 100
    const degrees = Math.round((percent / 100) * 360)
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <div
                    className="h-36 w-36 rounded-full"
                    style={{
                        background: `conic-gradient(${fillColor} ${degrees}deg, ${backgroundColor} ${degrees}deg 360deg)`, // <- 🥳
                    }}
                />
                <div
                    className="h-36 w-36 rounded-full absolute left-0 top-0 bg-white flex flex-col items-center justify-center"
                    style={{ clipPath: 'circle(36%)' }}
                >
                    <p className="mb-0 font-bold text-lg">
                        {Math.round(percent * 100) / 100}%
                    </p>
                    <p className="mb-0">
                        {amount}/{totalAmount}
                    </p>
                </div>
            </div>
        </div>
    )
}

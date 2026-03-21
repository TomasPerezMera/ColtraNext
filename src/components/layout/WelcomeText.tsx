export default function WelcomeText() {
    return (
        <>
        <div className="welcome-text text-center space-y-4">
            <p className="text-base md:text-lg leading-relaxed">
                <b>Hola!</b>
                <br></br>
                Llegaste al Rincón de Coltrane.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
                Un pequeño, pero valioso rincón de Internet, donde podrás adquirir algunos de los álbumes más célebres del legendario saxofonista en formato de vinilo.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
                A continuación, procederemos a listar los ítems disponibles. Debido al stock limitado, se permite un máximo de 3 vinilos por compra - elegí con cuidado!
            </p>
        </div>
        </>
    );
}
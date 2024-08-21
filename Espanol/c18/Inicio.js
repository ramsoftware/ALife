/* Autor: Rafael Alberto Moreno Parra
Fecha: Septiembre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

	//Crea el objeto que hace el gráfico
	var Grafico3D = new Grafico();

    //Ángulos aleatorios para simular animación
	var AnguloX = Math.trunc(Math.random()*360);
	var AnguloY = Math.trunc(Math.random()*360);
	var AnguloZ = Math.trunc(Math.random()*360);

	var AnguloXNuevo = Math.trunc(Math.random()*360);
	var AnguloYNuevo = Math.trunc(Math.random()*360);
	var AnguloZNuevo = Math.trunc(Math.random()*360);
	
    //Variable Tiempo
    var Tminimo = 1;
    var Tmaximo = 3.0;
    var Tincrementa = 0.02;
    var Tiempo = Tminimo;	

	//Para los cálculos de la ecuación
    var MinimoX = -9;
    var MinimoY = -9;
    var MaximoX = 9;
    var MaximoY = 9;
    var NumeroLineasGrafico = 30;

	//Anima el gráfico
	Graficar();
	

	function Graficar(){
	
		//Captura el canvas
		let Canvas = document.getElementById('MiCanvas');

		//Captura el lienzo
		let Lienzo = Canvas.getContext('2d');
		
		//Calcula la ecuación
		Grafico3D.CalculaEcuacion(MinimoX, MinimoY, MaximoX, MaximoY, NumeroLineasGrafico, Tiempo);
				
		//Calcula el gráfico
        let ZPersona = 5;
        let XPantallaIni = 0;
        let YPantallaIni = 0;
        let XPantallaFin = Canvas.width;
        let YPantallaFin = Canvas.height;		
		Grafico3D.CalculaGrafico(AnguloX, AnguloY, AnguloZ, ZPersona, XPantallaIni, YPantallaIni, XPantallaFin, YPantallaFin);
		
		//Dibuja el gráfico
		let GrosorLinea = 1;
		let ColorLinea = '#8A2BE2';
		let ColorRelleno = '#FFFFFF';	
		Grafico3D.Dibuja(Canvas, Lienzo, GrosorLinea, ColorLinea, ColorRelleno);
		
		//Modifica los ángulos
		if (AnguloX > AnguloXNuevo) IncrAngX = -1; else IncrAngX = 1;
        if (AnguloY > AnguloYNuevo) IncrAngY = -1; else IncrAngY = 1;
        if (AnguloZ > AnguloZNuevo) IncrAngZ = -1; else IncrAngZ = 1;

        AnguloX += IncrAngX;
        AnguloY += IncrAngY;
        AnguloZ += IncrAngZ;

        if (AnguloX == AnguloXNuevo) AnguloXNuevo = Math.trunc(Math.random()*360);
        if (AnguloY == AnguloYNuevo) AnguloYNuevo = Math.trunc(Math.random()*360);
        if (AnguloZ == AnguloZNuevo) AnguloZNuevo = Math.trunc(Math.random()*360);
		
        //Cambia el valor de la variable tiempo
        Tiempo += Tincrementa;
        if (Tiempo <= Tminimo || Tiempo >= Tmaximo) Tincrementa = -Tincrementa;		
		
		requestAnimationFrame(Graficar);		
	}
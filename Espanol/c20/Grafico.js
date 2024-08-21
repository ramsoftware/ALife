/* Autor: Rafael Alberto Moreno Parra
Fecha: Octubre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

/* ************************************************
 *  Un gráfico tiene muchos fotogramas
 * ************************************************ */
class Grafico{

	//Datos para hacer el gráfico
	DatosEntrada(Canvas){
		//Ángulos
		let AnguloX = parseFloat(document.getElementById("AnguloX").value);
		let AnguloY = parseFloat(document.getElementById("AnguloY").value);
		let AnguloZ = parseFloat(document.getElementById("AnguloZ").value);
		
		let NumeroLineasGrafico = parseInt(document.getElementById("NumLineas").value);

		//Variable Tiempo. Precalcula los polígonos para cada unidad de tiempo
		let Tminimo = parseFloat(document.getElementById("MinimoT").value);
		let Tmaximo = parseFloat(document.getElementById("MaximoT").value);
		if (Tminimo >= Tmaximo){
			document.getElementById("Observacion").value = "El valor de Mínimo T debe ser menor que Máximo T";
			return;
		}		
		
		let Tincrementa = parseFloat(document.getElementById("IncrementoT").value);

		//Las expresiones
		let Expresiones = document.getElementById("Expresiones").value;
		let ListaExpresion = Expresiones.split(";");
		
		//Chequea sintaxis de cada expresión
		let Evaluador = new Evaluador4();
		for (let Cont=0; Cont < ListaExpresion.length; Cont++){
			let Sintaxis = Evaluador.EvaluaSintaxis(ListaExpresion[Cont]);
			if (Sintaxis != -1){
				document.getElementById("Observacion").value = "Ecuación " + Cont + " tiene error de sintaxis: " + Evaluador.MensajeError(Sintaxis);
				return;
			}
		}
		document.getElementById("Observacion").value = "Ecuaciones correctas. Se procede a graficar";
		
		//Evalua cada expresión
		let Evalua = [];
		for (let Cont=0; Cont < ListaExpresion.length; Cont++){
			Evalua.push(new Evaluador4());
			Evalua[Evalua.length-1].Analizar(ListaExpresion[Cont]);
		}

		//Crea los fotogramas (uno por cada unidad de tiempo)
		this.Fotogramas = [];
  
		//Precalcula los fotogramas (por cada unidad de tiempo)
		for (let Tiempo = Tminimo; Tiempo <= Tmaximo; Tiempo += Tincrementa){
			this.Fotogramas.push(new Fotograma(NumeroLineasGrafico, Tiempo, Evalua));
		}

		//Para mover de fotograma en fotograma
		this.FotogramaGrafica = 0;
		this.FotogramaIncrementa = 1;
		
		//Calcula la posición de los polígonos
		this.CalculaPoligono(AnguloX, AnguloY, AnguloZ, Canvas);
	}
	
	CalculaPoligono(AnguloX, AnguloY, AnguloZ, Canvas){
		//Distancia del observador
		let ZPersona = 5;
		
		//Calcula el gráfico (giro, proyección 2D, cuadrar en pantalla)
		let XPantallaIni = 0;
		let YPantallaIni = 0;
		let XPantallaFin = Canvas.width;
		let YPantallaFin = Canvas.height;		
		
		//Precalcula los fotogramas (por cada unidad de tiempo)
		let TotalFoto = this.Fotogramas.length;
		for (let Foto = 0; Foto < TotalFoto; Foto++){
			this.Fotogramas[Foto].CalculaPoligono(AnguloX, AnguloY, AnguloZ, ZPersona, XPantallaIni, YPantallaIni, XPantallaFin, YPantallaFin);
		}
	}
	
	
	Graficar(Lienzo, Ancho, Alto){
		//Dibuja el fotograma actual
		this.Fotogramas[this.FotogramaGrafica].Dibuja(Lienzo, Ancho, Alto);
			
		//Se mueve al siguiente fotograma del gráfico en el tiempo
		if (this.FotogramaGrafica + this.FotogramaIncrementa < 0 || this.FotogramaGrafica + this.FotogramaIncrementa >= this.Fotogramas.length) 
			this.FotogramaIncrementa *= -1;
		
		this.FotogramaGrafica += this.FotogramaIncrementa;
	}
}

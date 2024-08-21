class Pieza{
    constructor(){
        this.Operacion = 0;
        this.ValorDeducido = [];
        this.PiezasActuan = [];
    }

    Imprime() {
        let Tabla = "<td>";
        switch (this.Operacion) {
            case 0: Tabla += "Base;"; break; //Ecuación (asignación directa)
            case 1: Tabla += "MAX( "; break; //Máximo
            case 2: Tabla += "MIN( "; break; //Mínimo
            case 3: Tabla += "ALT( "; break; //Alternar
            case 4: Tabla += "PRO( "; break; //Promedio
        }

        if (this.Operacion == 0) {
            Tabla += "<td>";
            for (let cont = 0; cont < this.ValorDeducido.length; cont++) {
                Tabla += this.ValorDeducido[cont].toFixed(4).replaceAll(".", ",") + "; ";
            }
        }
        else {
            for (let cont = 0; cont < this.PiezasActuan.length; cont++) {
                Tabla += this.PiezasActuan[cont] + ", ";
            }
            Tabla += ");</td><td>";
            for (let cont = 0; cont < this.ValorDeducido.length; cont++) {
                Tabla += this.ValorDeducido[cont].toFixed(4).replaceAll(".", ",") + "; ";
            }
        }
        Tabla += "</td>";
        return Tabla;
    }
}

class Evalua {
    constructor() {
        this.Piezas = [];
    }

    //Adiciona los valores dados por las ecuaciones base
    AdicionaEcuacionBase(NumDatos) {
        //Valores al azar para la ecuación base
		let A = Math.random() - Math.random();
		let B = Math.random() - Math.random();
		let C = Math.random() - Math.random();

		let D = Math.random() - Math.random();
		let E = Math.random() - Math.random();
		let F = Math.random() - Math.random();

		let G = Math.random() - Math.random();
		let H = Math.random() - Math.random();
		let I = Math.random() - Math.random();
		
		let Limite = 360 * (Math.round(Math.random() * (10-1)) + 1);
		let Avance = Limite / NumDatos;
		
		let Datos = [];
        let Ymin = Number.MAX_VALUE; //El mínimo valor de Y obtenido
        let Ymax = -Ymin; //El máximo valor de Y obtenido		
        for (let X = 0; X <= Limite; X += Avance) {
			let Xrad = Math.PI * X / 180;
			let Y = A*Math.sin(B*Xrad+C) + D*Math.sin(E*Xrad+F) + G*Math.sin(H*Xrad+I);
			if (Y > Ymax) Ymax = Y;
			if (Y < Ymin) Ymin = Y;
		    Datos.push(Y);   
        }
		
		//Normaliza
		let pieza = new Pieza();
		for (let cont = 0; cont < Datos.length; cont++) {
			pieza.ValorDeducido.push((Datos[cont]-Ymin)/(Ymax-Ymin));
		}
		pieza.Operacion = 0; //Es asignación directa
        this.Piezas.push(pieza);
    }

    GeneraModelo(NumDatos, EcuacionesBase, numPiezas) {

        //Primero las ecuaciones base
        for (let cont = 1; cont <= EcuacionesBase; cont++)
            this.AdicionaEcuacionBase(NumDatos);

        //Segundo, las operaciones de colaboración
        for (let numPieza = 1; numPieza <= numPiezas; numPieza++) {
            let pieza = new Pieza();

            //Operación de colaboración al azar
            pieza.Operacion = this.EnteroEntre(1, 4);

            //Garantiza que haya mínimo dos ecuaciones dentro de la operación de colaboración
            do {
                pieza.PiezasActuan.length = 0;
                for (let cont = 0; cont < this.Piezas.length; cont++) {
                    if (Math.random() >= 0.5) {
                        pieza.PiezasActuan.push(cont);
                    }
                }
            } while (pieza.PiezasActuan.length < 2);

            this.Piezas.push(pieza);
        }
    }

    //Ejecuta todo el individuo compuesto
    Ejecutar() {
        for (let cont=0; cont < this.Piezas.length; cont++){
            switch (this.Piezas[cont].Operacion) {
                case 1: this.EjecutaMAX(cont); break; //Máximo
                case 2: this.EjecutaMIN(cont); break; //Mínimo
                case 3: this.EjecutaALT(cont); break; //Alternar
                case 4: this.EjecutaAVG(cont); break; //Promedio
            }
        }
    }

    //Ejecuta la operación de colaboración MAX (máximo)
    EjecutaMAX(numPieza) {
        let tmpPieza = this.Piezas[numPieza];

        //Va de valor en valor en vertical
        for (let posValor = 0; posValor < this.Piezas[0].ValorDeducido.length; posValor++) {
            let maximo = Number.MAX_VALUE * -1;

            //Va de ecuación en ecuación (de las que participen en la expresión)
            for (let ecuacion = 0; ecuacion < tmpPieza.PiezasActuan.length; ecuacion++) {
                let tmpValor = this.Piezas[tmpPieza.PiezasActuan[ecuacion]].ValorDeducido[posValor];
                if (tmpValor > maximo)
                    maximo = tmpValor;
            }
            tmpPieza.ValorDeducido.push(maximo);
        }
    }

    //Ejecuta la operación de colaboración MIN (mínimo)
    EjecutaMIN(numPieza) {
        let tmpPieza = this.Piezas[numPieza];

        //Va de valor en valor en vertical
        for (let posValor = 0; posValor < this.Piezas[0].ValorDeducido.length; posValor++) {
            let minimo = Number.MAX_VALUE;

            //Va de ecuación en ecuación (de las que participen en la expresión)
            for (let ecuacion = 0; ecuacion < tmpPieza.PiezasActuan.length; ecuacion++) {
                let tmpValor = this.Piezas[tmpPieza.PiezasActuan[ecuacion]].ValorDeducido[posValor];
                if (tmpValor < minimo)
                    minimo = tmpValor;
            }
            tmpPieza.ValorDeducido.push(minimo);
        }
    }

    //Ejecuta la operación de colaboración ALT (alterna)
    EjecutaALT(numPieza) {
        let tmpPieza = this.Piezas[numPieza];

        //Va de valor en valor en vertical
        let Alternar = 0;
        for (let posValor = 0; posValor < this.Piezas[0].ValorDeducido.length; posValor++) {
            tmpPieza.ValorDeducido.push(this.Piezas[tmpPieza.PiezasActuan[Alternar++]].ValorDeducido[posValor]);
            if (Alternar >= tmpPieza.PiezasActuan.length) Alternar = 0;
        }
    }

    //Ejecuta la operación de colaboración AVG (promedio)
    EjecutaAVG(numPieza) {
        let tmpPieza = this.Piezas[numPieza];

        //Va de valor en valor en vertical
        for (let posValor = 0; posValor < this.Piezas[0].ValorDeducido.length; posValor++) {
            let valor = 0;

            //Va de ecuación en ecuación (de las que participen en la expresión)
            for (let ecuacion = 0; ecuacion < tmpPieza.PiezasActuan.length; ecuacion++) {
                valor += this.Piezas[tmpPieza.PiezasActuan[ecuacion]].ValorDeducido[posValor];
            }
            valor /= tmpPieza.PiezasActuan.length;
            tmpPieza.ValorDeducido.push(valor);
        }
    }

    /**
     * Retorna un número aleatorio entero entre mínimo y máximo, ambos incluyentes
     * @param minimo - Mínimo valor entero
     * @param maximo - Máximo valor entero
     * @returns {*} - Número entero
     */
    EnteroEntre(minimo, maximo){
        return Math.round(Math.random() * (maximo-minimo)) + minimo;
    }

    //Imprime el individuo compuesto en formato tabla HTML5
    Imprime() {
        let Tabla = "";
        for (let cont=0; cont < this.Piezas.length; cont++) {
            Tabla += "<tr><td>" + cont + ";</td>";
            Tabla += this.Piezas[cont].Imprime() + "</tr>";
        }
        document.write(Tabla);
    }
}

objEvaluar = new Evalua();
let NumDatos = 10;
let EcuacionesBase = 5;
let PiezasGenera = 15;
objEvaluar.GeneraModelo(NumDatos, EcuacionesBase, PiezasGenera);
objEvaluar.Ejecutar();
objEvaluar.Imprime();


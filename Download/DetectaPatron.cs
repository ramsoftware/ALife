using System;

namespace DetectaPatron {
    //La clase que implementa el perceptrón
    class Perceptron {
        private double[,,] W; //Los pesos serán arreglos multidimensionales. Así: W[capa, neurona inicial, neurona final]
        private double[,] U; //Los umbrales de cada neurona serán arreglos bidimensionales. Así: U[capa, neurona que produce la salida]
        double[,] A; //Las salidas de cada neurona serán arreglos bidimensionales. Así: A[capa, neurona que produce la salida]

        private double[,,] WN; //Los nuevos pesos serán arreglos multidimensionales. Así: W[capa, neurona inicial, neurona final]
        private double[,] UN; //Los nuevos umbrales de cada neurona serán arreglos bidimensionales. Así: U[capa, neurona que produce la salida]

        private int TotalCapas; //El total de capas que tendrá el perceptrón incluyendo la capa de entrada
        private int[] neuronasporcapa; //Cuantas neuronas habrá en cada capa
        private int TotalEntradas; //Total de entradas externas del perceptrón
        private int TotalSalidas; //Total salidas externas del perceptrón

        public Perceptron(int TotalEntradas, int TotalSalidas, int TotalCapas, int[] neuronasporcapa) {
            this.TotalEntradas = TotalEntradas;
            this.TotalSalidas = TotalSalidas;
            this.TotalCapas = TotalCapas;
            int maxNeuronas = 0; //Detecta el máximo número de neuronas por capa para dimensionar los arreglos
            this.neuronasporcapa = new int[TotalCapas + 1];
            for (int capa = 1; capa <= TotalCapas; capa++) {
                this.neuronasporcapa[capa] = neuronasporcapa[capa];
                if (neuronasporcapa[capa] > maxNeuronas) maxNeuronas = neuronasporcapa[capa];
            }

            //Dimensiona con el máximo valor
            W = new double[TotalCapas + 1, maxNeuronas + 1, maxNeuronas + 1];
            U = new double[TotalCapas + 1, maxNeuronas + 1];
            WN = new double[TotalCapas + 1, maxNeuronas + 1, maxNeuronas + 1];
            UN = new double[TotalCapas + 1, maxNeuronas + 1];
            A = new double[TotalCapas + 1, maxNeuronas + 1];

            //Da valores aleatorios a pesos y umbrales
            Random azar = new Random();

            for (int capa = 2; capa <= TotalCapas; capa++)
                for (int i = 1; i <= neuronasporcapa[capa]; i++)
                    U[capa, i] = azar.NextDouble();

            for (int capa = 1; capa < TotalCapas; capa++)
                for (int i = 1; i <= neuronasporcapa[capa]; i++)
                    for (int j = 1; j <= neuronasporcapa[capa + 1]; j++)
                        W[capa, i, j] = azar.NextDouble();
        }

        public void Procesa(double[] E) {
            //Entradas externas del perceptrón pasan a la salida de la primera capa
            for (int copia = 1; copia <= TotalEntradas; copia++) A[1, copia] = E[copia];

            //Proceso del perceptrón
            for (int capa = 2; capa <= TotalCapas; capa++)
                for (int neurona = 1; neurona <= neuronasporcapa[capa]; neurona++) {
                    A[capa, neurona] = 0;
                    for (int entra = 1; entra <= neuronasporcapa[capa - 1]; entra++)
                        A[capa, neurona] += A[capa - 1, entra] * W[capa - 1, entra, neurona];
                    A[capa, neurona] += U[capa, neurona];
                    A[capa, neurona] = 1 / (1 + Math.Exp(-A[capa, neurona]));
                }
        }

        // Muestra las entradas externas del perceptrón, las salidas esperadas y las salidas reales
        public void Muestra(double[] E, double[] S, double minimoX, double maximoX, double minimoY, double maximoY) {
            //Console.Write(E[1]*(maximoX- minimoX)+minimoX); Console.Write(" ===> ");
            //Console.Write(S[1]*(maximoY- minimoY)+minimoY); Console.Write(" <vs> ");
            Console.WriteLine(A[TotalCapas, 1]*(maximoY- minimoY)+minimoY); //Salidas reales del perceptrón
        }

        //El entrenamiento es ajustar los pesos y umbrales
        public void Entrena(double alpha, double[] E, double[] S) {
            //Ajusta pesos capa3 ==> capa4
            for (int j = 1; j <= neuronasporcapa[3]; j++)
                for (int i = 1; i <= neuronasporcapa[4]; i++) {
                    double Yi = A[4, i];
                    double dE3 = A[3, j] * (Yi - S[i]) * Yi * (1 - Yi);
                    WN[3, j, i] = W[3, j, i] - alpha * dE3; //Nuevo peso se guarda temporalmente
                }

            //Ajusta pesos capa2 ==> capa3
            for (int j = 1; j <= neuronasporcapa[2]; j++)
                for (int k = 1; k <= neuronasporcapa[3]; k++) {
                    double acum = 0;
                    for (int i = 1; i <= neuronasporcapa[4]; i++) {
                        double Yi = A[4, i];
                        acum += W[3, k, i] * (Yi - S[i]) * Yi * (1 - Yi);
                    }
                    double dE2 = A[2, j] * A[3, k] * (1 - A[3, k]) * acum;
                    WN[2, j, k] = W[2, j, k] - alpha * dE2; //Nuevo peso se guarda temporalmente
                }

            //Ajusta pesos capa1 ==> capa2
            for (int j = 1; j <= neuronasporcapa[1]; j++)
                for (int k = 1; k <= neuronasporcapa[2]; k++) {
                    double acumular = 0;
                    for (int p = 1; p <= neuronasporcapa[3]; p++) {
                        double acum = 0;
                        for (int i = 1; i <= neuronasporcapa[4]; i++) {
                            double Yi = A[4, i];
                            acum += W[3, p, i] * (Yi - S[i]) * Yi * (1 - Yi);
                        }
                        acumular += W[2, k, p] * A[3, p] * (1 - A[3, p]) * acum;
                    }
                    double dE1 = E[j] * A[2, k] * (1 - A[2, k]) * acumular;
                    WN[1, j, k] = W[1, j, k] - alpha * dE1; //Nuevo peso se guarda temporalmente
                }

            //Ajusta umbrales de neuronas de la capa 4
            for (int i = 1; i <= neuronasporcapa[4]; i++) {
                double Yi = A[4, i];
                double dE4 = (Yi - S[i]) * Yi * (1 - Yi);
                UN[4, i] = U[4, i] - alpha * dE4; //Nuevo umbral se guarda temporalmente
            }

            //Ajusta umbrales de neuronas de la capa 3
            for (int k = 1; k <= neuronasporcapa[3]; k++) {
                double acum = 0;
                for (int i = 1; i <= neuronasporcapa[4]; i++) {
                    double Yi = A[4, i];
                    acum += W[3, k, i] * (Yi - S[i]) * Yi * (1 - Yi);
                }
                double dE3 = A[3, k] * (1 - A[3, k]) * acum;
                UN[3, k] = U[3, k] - alpha * dE3; //Nuevo umbral se guarda temporalmente
            }

            //Ajusta umbrales de neuronas de la capa 2
            for (int k = 1; k <= neuronasporcapa[2]; k++) {
                double acumular = 0;
                for (int p = 1; p <= neuronasporcapa[3]; p++) {
                    double acum = 0;
                    for (int i = 1; i <= neuronasporcapa[4]; i++) {
                        double Yi = A[4, i];
                        acum += W[3, p, i] * (Yi - S[i]) * Yi * (1 - Yi);
                    }
                    acumular += W[2, k, p] * A[3, p] * (1 - A[3, p]) * acum;
                }
                double dE2 = A[2, k] * (1 - A[2, k]) * acumular;
                UN[2, k] = U[2, k] - alpha * dE2; //Nuevo umbral se guarda temporalmente
            }

            //Copia los nuevos pesos y umbrales a los pesos y umbrales respectivos del perceptrón
            for (int capa = 2; capa <= TotalCapas; capa++)
                for (int i = 1; i <= neuronasporcapa[capa]; i++)
                    U[capa, i] = UN[capa, i];

            for (int capa = 1; capa < TotalCapas; capa++)
                for (int i = 1; i <= neuronasporcapa[capa]; i++)
                    for (int j = 1; j <= neuronasporcapa[capa + 1]; j++)
                        W[capa, i, j] = WN[capa, i, j];
        }
    }

    class Program {
        static void Main(string[] args) {
            int TotalEntradas = 1; //Número de entradas externas del perceptrón
            int TotalSalidas = 1; //Número de salidas externas del perceptrón
            int TotalCapas = 4; //Total capas que tendrá el perceptrón
            int[] neuronasporcapa = new int[TotalCapas + 1]; //Los índices iniciarán en 1 en esta implementación
            neuronasporcapa[1] = TotalEntradas; //Entradas externas del perceptrón
            neuronasporcapa[2] = 8; //Capa oculta con 8 neuronas
            neuronasporcapa[3] = 8; //Capa oculta con 8 neuronas
            neuronasporcapa[4] = TotalSalidas; //Capa de salida con 1 neurona

            Perceptron objP = new Perceptron(TotalEntradas, TotalSalidas, TotalCapas, neuronasporcapa);

            //Lee los datos de un archivo plano
            int MaximosRegistros = 2000;
            double[][] entrada = new double[MaximosRegistros + 1][];
            double[][] salidas = new double[MaximosRegistros + 1][];
            const string urlArchivo = "datos.tendencia";
            int ConjuntoEntradas = LeeDatosArchivo(urlArchivo, entrada, salidas);

            //Normaliza los valores entre 0 y 1 que es lo que requiere el perceptrón
            double minimoX = entrada[1][1], maximoX = entrada[1][1];
            double minimoY = salidas[1][1], maximoY = salidas[1][1];
            for (int cont = 1; cont <= ConjuntoEntradas; cont++) {
                if (entrada[cont][1] > maximoX) maximoX = entrada[cont][1];
                if (salidas[cont][1] > maximoY) maximoY = salidas[cont][1];
                if (entrada[cont][1] < minimoX) minimoX = entrada[cont][1];
                if (salidas[cont][1] < minimoY) minimoY = salidas[cont][1];
            }

            for (int cont = 1; cont <= ConjuntoEntradas; cont++) {
                entrada[cont][1] = (entrada[cont][1] - minimoX) / (maximoX - minimoX);
                salidas[cont][1] = (salidas[cont][1] - minimoY) / (maximoY - minimoY);
            }

            //Inicia el proceso de la red neuronal
            double alpha = 0.4; //Factor de aprendizaje
            for (int epoca = 1; epoca <= 64000; epoca++) {
                if (epoca % 4000 == 0) Console.WriteLine("Iteracion: " + epoca);
                //Importante: Se envía el primer conjunto de entradas-salidas, luego el segundo, tercero y cuarto
                //por cada ciclo de entrenamiento. 
                for (int entra = 1; entra <= ConjuntoEntradas; entra++) {
                    objP.Procesa(entrada[entra]);
                    objP.Entrena(alpha, entrada[entra], salidas[entra]);
                }
            }

            //Muestra el resultado
            for (int entra = 1; entra <= ConjuntoEntradas; entra++) {
                objP.Procesa(entrada[entra]);
                objP.Muestra(entrada[entra], salidas[entra], minimoX, maximoX, minimoY, maximoY);
            }

            Console.ReadKey();
        }

        private static int LeeDatosArchivo(string urlArchivo, double[][] entrada, double[][] salida) {
            var archivo = new System.IO.StreamReader(urlArchivo);
            archivo.ReadLine(); //La línea de simple serie
            archivo.ReadLine(); //La línea de título de cada columna de datos
            string leelinea;

            int limValores = 0;
            while ((leelinea = archivo.ReadLine()) != null) {
                limValores++;
                double valX = TraerNumeroCadena(leelinea, ';', 1);
                double valY = TraerNumeroCadena(leelinea, ';', 2);
                entrada[limValores] = new double[] { 0, valX };
                salida[limValores] = new double[] { 0, valY };
            }
            archivo.Close();
            return limValores;
        }

        //Dada una cadena con separaciones por delimitador, trae determinado ítem
        private static double TraerNumeroCadena(string linea, char delimitador, int numeroToken) {
            string numero = "";
            int numTrae = 0;
            foreach (char t in linea) {
                if (t != delimitador)
                    numero = numero + t;
                else {
                    numTrae = numTrae + 1;
                    if (numTrae == numeroToken) {
                        numero = numero.Trim();
                        if (numero == "") return 0;
                        return Convert.ToDouble(numero);
                    }
                    numero = "";
                }
            }
            numero = numero.Trim();
            if (numero == "") return 0;
            return Convert.ToDouble(numero);
        }
    }
}

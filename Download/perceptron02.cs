using System;
namespace Perceptron2 {
    public class Program {
        public static void Main(String[] args){
            int[,] tabla = { { 1, 1, 1 }, { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 0 } }; //Tabla de verdad AND: { x1, x2, salida }
            Random azar = new Random();
            double[] pesos = { azar.NextDouble(), azar.NextDouble(), azar.NextDouble() }; //Inicia los pesos al azar
            bool aprendiendo = true;
            int salidaEntera;
            double tasaAprende = 0.3;
            while (aprendiendo) { //Hasta que aprenda la tabla AND
                aprendiendo = false;
                for (int cont = 0; cont <= 3; cont++) {
                    double salidaReal = tabla[cont, 0] * pesos[0] + tabla[cont, 1] * pesos[1] + pesos[2]; //Calcula la salida real
                    if (salidaReal > 0) salidaEntera = 1; else salidaEntera = 0; //Transforma a valores 0 o 1
                    int error = tabla[cont, 2] - salidaEntera;
                    if (error != 0){ //Si la salida no coincide con lo esperado, cambia los pesos con la fórmula de Rossenblatt
                        pesos[0] += tasaAprende * error * tabla[cont, 0];
                        pesos[1] += tasaAprende * error * tabla[cont, 1];
                        pesos[2] += tasaAprende * error * 1;
                        aprendiendo = true; //Y sigue buscando
                    }
                }
            }

            for (int cont = 0; cont <= 3; cont++){ //Muestra el perceptron con la tabla AND aprendida
                double salidaReal = tabla[cont, 0] * pesos[0] + tabla[cont, 1] * pesos[1] + pesos[2];
                if (salidaReal > 0) salidaEntera = 1; else salidaEntera = 0;
                Console.WriteLine("Entradas: " + tabla[cont, 0].ToString() + " y " + tabla[cont, 1].ToString() + " = " +
                    tabla[cont, 2].ToString() + " perceptron: " + salidaEntera.ToString());
            }
            Console.ReadLine();
        }
    }
}
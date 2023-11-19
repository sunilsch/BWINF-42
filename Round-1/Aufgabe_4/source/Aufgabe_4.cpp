#include <bits/stdc++.h>

#define ve vector
#define vb ve<bool>
#define everyN(var) for(int var = 0; var < n; var++)
#define everyM(var) for(int var = 0; var < m; var++)

using namespace std;
ifstream inputFile; // input file stream
ofstream outputFile; // output file stream
int n, m, nOfInputs = 0;
ve<vb> states, results, combinations;
ve<ve<string>> field;

/**
 * @brief Get the Filename object
 * 
 * @return string (filename)
 */
string getFilename(){
    string filename; 
    cout << "Please enter filename without file extension" << endl; // print message to user
    cout << "Files must be located in '/beispieleingaben/'" << endl;
    cout << "-> ";
    cin >> filename; // get input from user
    return filename;
}

/**
 * @brief Read data from input file
 * 
 */
void readData(){
    inputFile >> m >> n;
    field.resize(n);
    everyN(i){
        field[i].resize(m);
        everyM(j){
            inputFile >> field[i][j];
            if(field[i][j].at(0) == 'Q') nOfInputs++;
        }
    }
    inputFile.close();
}

/**
 * @brief Reset all entries in states matrix to false
 * 
 */
void resetStates(){
    states.resize(n);
    everyN(i){
        states[i].resize(m);
        everyM(j)
            states[i][j] = false;
    }
}

/**
 * @brief Generate all possible binary combinations of length n
 * 
 * @param n Length of combinations
 * @param arr Combination array
 * @param i Current index
 */
void generateCombinationsRecursiv(int n, bool arr[], int i){
    if(i == n){
        combinations.push_back(vb(arr, arr+n));
        return;
    }
    arr[i] = false;
    generateCombinationsRecursiv(n, arr, i+1);
    arr[i] = true;
    generateCombinationsRecursiv(n, arr, i+1);
}

/**
 * @brief Start recursive combination generation
 * 
 */
void generateInputs(){
    bool arr[n];
    generateCombinationsRecursiv(nOfInputs, arr, 0);
}

/**
 * @brief Raise error and exit program
 * 
 */
void raiseError(){
    cout << "unexcepted character" << endl;
    cout << "invalid input" << endl;
    exit(1);
}

/**
 * @brief Set the value of state array at (i,j) and (i,j+1) to val
 * 
 * @param i 
 * @param j 
 * @param val 
 */
void setStates(int i, int j, bool val){
    states[i][j] = val;
    states[i][j+1] = val;
}

/**
 * @brief Calculate result for given combination
 * 
 * @param combinationIndex 
 * @return vector<bool> (result)
 */
vb calculateResult(int combinationIndex){
    vb result;
    int cur = 0;
    everyM(j)
        if(field[0][j].at(0) == 'Q')
            states[0][j] = combinations[combinationIndex][cur++];
    for(int i = 1; i < n-1; i++){
        everyM(j){
            if(field[i][j] == "W"){
                if(field[i][j+1] != "W") raiseError();
                setStates(i, j, !(states[i-1][j] && states[i-1][j+1]));
            } else if(field[i][j] == "B"){
                if(field[i][j+1] != "B") raiseError();
                setStates(i, j, states[i-1][j] || states[i-1][j+1]);
            } else if(field[i][j] == "r"){
                if(field[i][j+1] != "R") raiseError();
                setStates(i, j, !states[i-1][j+1]);
            } else if(field[i][j] == "R"){
                if(field[i][j+1] != "r") raiseError();
                setStates(i, j, !states[i-1][j]);
            } else {
                if(field[i][j] != "X") raiseError();
                j--;
            }
            j++;
        }
    }
    everyM(j)
        if(field[n-1][j].at(0) == 'L')
            result.push_back(states[n-2][j]);
    return result;
}

/**
 * @brief Start calculation of all results
 *        and measure time
 */
void calculateResults(){
    long long starttime = clock();
    for(int i = 0; i < combinations.size(); i++){  
        resetStates();
        results.push_back(calculateResult(i));
    }
    cout << "Calculated results in: " << ((long long)clock() - starttime) << " ms" << endl;
}

/**
 * @brief Print out results to console and output file
 * 
 * @param filename 
 */
void printResults(string filename){
    outputFile.open("../beispielausgaben/"+filename+"_out.txt");
    for(int i = 0; i < nOfInputs; i++){
        cout << "Q" << i+1 << "   ";
        outputFile << "Q" << i+1 << "   ";
    }
    cout << " | ";
    outputFile << " | "; 
    for(int i = 0; i < results[0].size(); i++){
        cout << "L" << i+1 << "   ";
        outputFile << "L" << i+1 << "   ";
    }
    cout << endl;
    outputFile << endl;
    for(int i = 0; i < results.size(); i++){
        for(int j = 0; j < combinations[i].size(); j++){
            cout << (combinations[i][j] ? "on   " : "off  ");
            outputFile << (combinations[i][j] ? "on   " : "off  ");
        }
        cout << " | ";
        outputFile << " | "; 
        for(int j = 0; j < results[i].size();j++){
            cout << (results[i][j] ? "on   " : "off  ");
            outputFile << (results[i][j] ? "on   " : "off  ");
        }  
        cout << endl;
        outputFile << endl;
    }
    outputFile.close();
}

/**
 * @brief Main function of program
 * 
 * @return int (exit code)
 */
int main(){
    string filename = getFilename(); // get filename for in-/output
    inputFile.open("../beispieleingaben/"+filename+".txt"); // open input file
    if(inputFile.is_open()) readData();
    else {
        cout << "File not found" << endl;
        exit(1);
    }
    generateInputs();
    calculateResults();
    printResults(filename);
    return 0;
}
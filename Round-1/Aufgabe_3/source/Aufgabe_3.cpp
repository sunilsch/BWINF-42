#include <bits/stdc++.h>

#define ve vector
#define pos pair<pair<int,int>, int> // position with (x,y) and z
#define pospos pair<pos, pos> // pair of two positions
#define graphNode pair<bool, pair<pos, int>> // node in grid with blocked? and (previous, min-distance)
#define everyN(var) for(int var = 0; var < n; var++) // for every row
#define everyM(var) for(int var = 0; var < m; var++) // for every column
#define INF_INT numeric_limits<int>::max()/2 // infinity for int
#define f first // first element of pair
#define s second // second element of pair

using namespace std; // use std namespace
ifstream inputFile; // input file stream
int n, m, length; // n = rows, m = columns, length = length of shortest path
pos start, stop; // start and stop position of path
ve<ve<graphNode>> g1; // grid 1 (z = 0)
ve<ve<graphNode>> g2; // grid 2 (z = 1)
ve<pos> path; // path from start to stop
ve<pair<pos, int>> allpos = { // all possible moves with (((dx, dy), changeZ?), move-costs)
    make_pair(make_pair(make_pair(0,1), 0), 1),
    make_pair(make_pair(make_pair(1,0), 0), 1),
    make_pair(make_pair(make_pair(0,-1), 0), 1),
    make_pair(make_pair(make_pair(-1,0), 0), 1),
    make_pair(make_pair(make_pair(0,0), 1), 3)
};

/**
 * @brief Get the filename from user
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
    inputFile >> n >> m; // read n and m from input file
    everyN(i){
        g1.push_back(ve<graphNode>()); // add new row to matrix
        g2.push_back(ve<graphNode>()); // add new row to matrix
        everyM(j){
            g1[i].push_back(make_pair(false, make_pair(make_pair(make_pair(-1,-1), -1), INF_INT))); // add new column to first matrix
            g2[i].push_back(make_pair(false, make_pair(make_pair(make_pair(-1,-1), -1), INF_INT))); // add new column to second matrix
        }
    }
    for(int z = 0; z < 2; z++){ // for both grids
        everyN(i){ // for every row
            everyM(j){ // for every column
                char input; // get input from file
                inputFile >> input;
                if(input == '#') // if input is '#', set blocked to true
                    if(z == 0)
                        g1[i][j].f = true;
                    else
                        g2[i][j].f = true;
                else if(input == 'A') // if input is 'A', set start position
                    start = make_pair(make_pair(i,j), z);
                else if(input == 'B') // if input is 'B', set stop position
                    stop = make_pair(make_pair(i,j), z);
            }
        }
    }
    inputFile.close(); // close input file
}

/**
 * @brief perform djikstra algorithm to find shortest path starting from start
 * 
 */
void findPath(){
    long long starttime = clock(); // start timer
    priority_queue<pair<int, pospos>, ve<pair<int, pospos>>, greater<pair<int, pospos>>> q; // priority queue with (distance, (current-position, previous-position))
    q.push(make_pair(0, make_pair(start, make_pair(make_pair(-1,-1), -1)))); // push start position with distance 0 and no previous position
    while(q.size()){ // while queue is not empty
        int d, z, x, y, newX, newY, newZ; 
        pos p, pre; // p = current position, pre = previous position
        pospos pp; // pp = pair of p and pre
        tie(d, pp) = q.top(); // get first element of queue
        tie(p, pre) = pp;
        tie(x, y) = p.f; // get current x and y
        z = p.s; // get current z
        q.pop(); // remove first element from queue
        if((z == 0 ? g1 : g2)[x][y].s.s <= d) continue; // if there is already a shorter path to this position, continue with next element
        (z == 0 ? g1 : g2)[x][y].s.s = d; // set distance to current position
        (z == 0 ? g1 : g2)[x][y].s.f.f = pre.f; // set previous position x and y
        (z == 0 ? g1 : g2)[x][y].s.f.s = pre.s; // set previous position z
        for(auto newpos : allpos){ // for every possible move
            newX = newpos.f.f.f + x; // get new x
            newY = newpos.f.f.s + y; // get new y
            newZ = newpos.f.s; // get new z
            if(newZ == 1 && (z == 0 ? g2 : g1)[newX][newY].f) continue; // if z changes and new position is blocked, continue with next element
            if((z == 0 ? g1 : g2)[newX][newY].f) continue; // if new position is blocked, continue with next element
            q.push(make_pair(d + newpos.s, make_pair(make_pair(make_pair(newX, newY), (newZ == 1 ? (z == 0 ? 1 : 0) : z)), p))); // push (distance, (pos, prev)) to queue
        }
    }
    long long endtime = clock(); // end timer
    cout << "Calculated path in: " << (endtime - starttime) << " ms" << endl; // print time needed to calculate path
    length = (stop.s == 0 ? g1 : g2)[stop.f.f][stop.f.s].s.s; // get length of shortest path
    cout << "Length of shortest path: " << length << endl; // print length of shortest path
}

/**
 * @brief Print out calculated path to user
 * 
 * @param path Calculated path
 */
void printPath(ve<pos> path){
    cout << "print path? (y/n)" << endl; // ask user if path should be printed
    char ans;
    cin >> ans;
    if(ans != 'y') return; // if user does not want to print path, return
    cout << "Path:" << endl << "x y z" << endl; // print header
    for(pos p : path) // for every position in path
        cout << p.f.f << " " << p.f.s << " " << p.s << endl; // print position
}

/**
 * @brief Generate content of output file and write to output file
 * 
 * @param path Calculated path
 * @param filename filename of input file without file extension
 * @param length length of calculated path
 */
void generateFileOutput(ve<pos> path, string filename, int length){
    ofstream outputFile; // create output file stream
    outputFile.open("../beispielausgaben/"+filename+"_out.txt"); // open output file
    char output1[n][m], output2[n][m]; // create output matrix 1 and 2
    for(int z = 0; z < 2; z++){ // for both grids
        everyN(i){ // for every row
            everyM(j){ // for every column
                if((z == 0 ? g1 : g2)[i][j].f) // if position is blocked, set output to '#'
                    (z == 0 ? output1 : output2)[i][j] = '#';
                else // else set output to '.'
                    (z == 0 ? output1 : output2)[i][j] = '.';
            }
        }
    }
    (start.s == 0 ? output1 : output2)[start.f.f][start.f.s] = 'A'; // set start position
    for(int i = 0; i < path.size()-1; i++){ // for every position in path
        int x = path[i].f.f;
        int y = path[i].f.s;
        int z = path[i].s;
        int nextX = path[i+1].f.f;
        int nextY = path[i+1].f.s;
        if(nextX - x == 1) // check if direction is down
            (z == 0 ? output1 : output2)[x][y]='v';
        else if(nextX - x == -1) // check if direction is up
            (z == 0 ? output1 : output2)[x][y]='^';
        else if(nextY - y == 1) // check if direction is right
            (z == 0 ? output1 : output2)[x][y]='>';
        else if(nextY - y == -1) // check if direction is left
            (z == 0 ? output1 : output2)[x][y]='<';
        else { // else set output to '!'
            output1[x][y]='!';
            output2[x][y]='!';
        }
    }
    (stop.s == 0 ? output1 : output2)[stop.f.f][stop.f.s] = 'B'; // set stop position
    outputFile << "Length of shortest path: " << length << endl; // write length of shortest path to output file
    everyN(i){ // for every row
        everyM(j) // for every column
            outputFile << output1[i][j]; // write output maxtrix 1 to output file
        outputFile << "   ";
        everyM(j) // for every column
            outputFile << output2[i][j]; // write output maxtrix 2 to output file
        outputFile << endl;
    }
    outputFile.close(); // close output file
}

/**
 * @brief Build path from start to stop after djikstra algorithm
 * 
 */
void buildPath(){
    pos p = stop; // start at stop position
    path = {stop}; // add stop position to path
    while(p != start) // while current position is not start position
        path.push_back(p = (p.s == 0 ? g1 : g2)[p.f.f][p.f.s].s.f); // add previous position to path
    reverse(path.begin(), path.end()); // reverse path, so it starts at start position
}

/**
 * @brief Main Function of program
 * 
 * @return int (exit code)
 */
int main(){
    string filename = getFilename(); // get filename for in-/output
    inputFile.open("../beispieleingaben/"+filename+".txt"); // open input file
    if(inputFile.is_open()) readData(); // if input file is open, read data from input file
    else {
        cout << "File not found" << endl; // if input file is not open, print error message
        return 1;
    }
    findPath(); // find shortest path
    buildPath(); // build path from start to stop
    printPath(path); // print path to user
    generateFileOutput(path, filename, length); // generate output file
    return 0;
}
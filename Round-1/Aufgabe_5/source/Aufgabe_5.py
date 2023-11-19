from copy import deepcopy

def read_file(filename: str):
    inp = []
    with open('../beispieleingaben/'+filename+'.txt', encoding='utf-8') as f:
        for line in f.readlines():
            line = line.strip()
            if line.isnumeric():
                continue
            splitted = line.split(",")
            inp.append([splitted[0], int(splitted[1]), splitted[2] == "X", int(splitted[3])])
    return inp

def kill_circle(inpList):
    seen = {}
    for i in range(len(inpList)):
        if inpList[i][0] in seen:
            front = inpList[0:seen[inpList[i][0]]]
            dif = inpList[i][3] - inpList[seen[inpList[i][0]]][3]
            last = inpList[i:]
            for x in last:
                x[3] -= dif
            front += last
            return front, True
        if inpList[i][2]:
            seen = {}
        seen[inpList[i][0]] = i
    return inpList, False

def kill_front(inp):
    inpList = []
    front = []
    back = []
    for i in range(len(inp)):
        if inp[i][2]:
            front = inp[0:i+1]
            break
    for i in reversed(range(len(inp))):
        if inp[i][2]:
            back = inp[i:]
            break
    for i,f in enumerate(front):
        for j,b in enumerate(back):
            if f[0] == b[0]:
                inpList.append(deepcopy(inp[i:len(inp)-len(back)+j+1]))
                dif = inpList[-1][0][3]
                for i in range(len(inpList[-1])):
                    inpList[-1][i][3] -= dif
    return inpList

def print_path(inp, f):
    print("Total distance: "+str(inp[-1][3]))
    f.write("Total distance: "+str(inp[-1][3])+"\n")
    print("Start", end="")
    f.write("Start")
    for x in inp:
        print(" -> ", end="")
        f.write(" -> ")
        print(x[0]+" "+str(x[1]), end="")
        f.write(x[0]+" "+str(x[1]))

def print_results(filename, inp, bestinp):
    with open('../beispielausgaben/'+filename+'_out.txt', 'w', encoding='utf-8') as f:
        print("Original Path: ")
        f.write("Original Path: \n")
        print_path(inp, f)
        print("\n\nBest Path with new distances: ")
        f.write("\n\nBest Path with new distances: \n")
        print_path(bestinp, f)

def main():
    filename = input("What file? -> ")
    inp = read_file(filename)
    inpList = kill_front(inp)
    for i in range(len(inpList)):
        run = True
        while run:
            inpList[i], run = kill_circle(inpList[i])
    if len(inpList) == 0:
        print("There was no essential node in this path!")
        open('../beispielausgaben/'+filename+'_out.txt', 'w', encoding='utf-8').write("There was no essential node in this path!")
        return
    bestinp = inpList[0]
    for x in inpList:
        if x[-1][3] < bestinp[-1][3]:
            bestinp = x
    print_results(filename, inp, bestinp)
    
if __name__ == '__main__':
    main()
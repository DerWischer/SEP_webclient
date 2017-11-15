import time


def is_safe(nodes, mod):
    prev = nodes[len(nodes)-1]
    num_nodes = len(nodes)
    for val in nodes:
        if val < 0 or val > mod:
            return False
        if (val == prev):
            return False
        prev = val
    return True

def increment(nodes, i, root_node, num_nodes):
    mod = 0
    if (i % num_nodes == root_node):
        mod = 3
    else:
        mod = 2
    neighbour = nodes[(i-1) % num_nodes]
    me =  nodes[i % num_nodes]
    if (is_safe(nodes, mod)):
        return -1
    if me < 0 or me > mod:
        nodes[i % num_nodes] = 0
    if (me == neighbour):
        nodes[i % num_nodes] = (me+1) % mod
    
    return i+1

def main(nodes):
    num_nodes = 5
    root_node = 0
    mod = 2
    i=0
    count = 0
    cont = True
    while True:
        i = increment(nodes, i, root_node, num_nodes)
        count = count + 1
        print ("%i rounds" % count)
        print (nodes)
        if (i == -1):
            break
        time.sleep(1)
    print ("Safe Reached")

main([5,1,0,1,0])
main([0,0,0,0,0])
main([1,1,1,1,1,3])


        

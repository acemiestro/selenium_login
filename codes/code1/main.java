import java.io.*;
import java.util.*;

public class Main {

    public static void main(String[] args) throws Exception {
        // write your code here
        Scanner scn = new Scanner(System.in);
        int n = scn.nextInt();
        int f = fact(n);
        System.out.println(f);
    }
    
    public static int fact(int n){
        
        if(n == 1){
            return 1;
        }
        
        int f = fact(n - 1);
        
        return f * n;
    }

}
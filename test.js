import test from "./test1.js";

function handle() {
    try {
        test()
    } catch (error) {
        // console.log(error);
        console.error(error.stack)
        
    }
}

handle()
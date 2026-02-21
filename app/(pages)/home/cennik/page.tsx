import { getPrices } from "@/actions";
import Cennik from "@/app/components/Cennik";
import { cookies } from "next/headers";

async function page() {

    const prices = await getPrices()
    cookies()
    return ( 
        <Cennik prices={prices}/>
     );
}

export default page;
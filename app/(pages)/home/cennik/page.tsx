import { getPrices } from "@/actions";
import Cennik from "@/app/components/Cennik";

async function page() {

    const prices = await getPrices()
    return ( 
        <Cennik prices={prices}/>
     );
}

export default page;
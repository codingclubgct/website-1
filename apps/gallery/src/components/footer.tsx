import { Button, Divider } from "@mui/material";

export default function footer(){
    return <div>
        <div className=" flex flex-col items-center bg-black  text-white gap-4">
            <p className="text-1xl p-2 ">Lorem ipsum dolor sit amet consectetur </p>
            <p className="text-2xl  mt-2 ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis, repudiandae.</p>
            <a href="https://indianexpress.com/article/explained/the-river-linking-project-rajasthan-mp-centre-have-signed-mou-for-who-it-helps-9133446/"><Button className="bg-orange-700 rounded-full h-16 w-16 text-white " variant="outlined" >get in touch</Button></a>
            <div className="flex flex-row bg-black text-white">
                <div className="flex flex-col bg-black text-white gap-1 p-16">
                    <p>osten</p>
                    <p>osten wilde</p>
                    <p>info@ostenwilde</p>
                    <p>studio london</p>
                </div>
                <div className="flex flex-col bg-black text-white gap-1 p-16">
                    <a href="https://indianexpress.com/article/explained/the-river-linking-project-rajasthan-mp-centre-have-signed-mou-for-who-it-helps-9133446/" className=" no-underline text-white"><p>project</p></a>
                    <a href="https://indianexpress.com/article/explained/the-river-linking-project-rajasthan-mp-centre-have-signed-mou-for-who-it-helps-9133446/" className=" no-underline text-white"><p>my story</p></a>
                    <a href="https://indianexpress.com/article/explained/the-river-linking-project-rajasthan-mp-centre-have-signed-mou-for-who-it-helps-9133446/" className=" no-underline text-white"><p>journal</p></a>
                    <a href="https://indianexpress.com/article/explained/the-river-linking-project-rajasthan-mp-centre-have-signed-mou-for-who-it-helps-9133446/" className=" no-underline text-white"><p>contact</p></a>
                </div>
                <div className="flex flex-col bg-black text-white gap-1 p-16">
                    <p>LinkedIn</p>
                    <p>Instagram</p>
                    <p>behance</p>
                    <p>twitter</p>
                </div>



            </div>
        </div>
        </div>
    
}
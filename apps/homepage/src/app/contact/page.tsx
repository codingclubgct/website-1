import { Container, Divider } from "@mui/material";


const contactItems = [
    {
        title: 'Mail', photo: 'https://imgs.search.brave.com/cl455ETGPrDE9uVb8_T9BnmdOR54DduQlx8Odq-fjB8/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9ibG9n/Lmh1YnNwb3QuY29t/L2h1YmZzL1BORy1K/UEcuanBn', items: [
            {
                name: 'Devi R', designation: 'Club Advisor', value: 'r.devi@gct.ac.in',
            },
            {
                name: 'Aditya R', designation: 'President', value: 'adithyaravichandran11@gmail.com',
            },
            {
                name: 'Joel Samuel Raj A', designation: 'Secretary', value: 'joel.sr1024@gmail.com',
            }
        ]
    },
    {
        title: 'Phone', photo: 'https://imgs.search.brave.com/cl455ETGPrDE9uVb8_T9BnmdOR54DduQlx8Odq-fjB8/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9ibG9n/Lmh1YnNwb3QuY29t/L2h1YmZzL1BORy1K/UEcuanBn', items: [
            {
                name: 'Devi R', designation: 'Club Advisor', value: '984 025 9907',
            },
            {
                name: 'Aditya R', designation: 'President', value: '968 856 6799',
            },
            {
                name: 'Joel Samuel Raj A', designation: 'Secretary', value: '860 850 9766',
            }
        ]
    }
]

export default function Page() {
    return <Container>
        <div className="flex flex-col gap-4 my-12 max-w-[500px]">
            <p className="text-4xl">Get in touch with us to get more information </p>
            <p className="text-subtext0">Unlocking possibilities, one connection at a time. Get in touch and let's create something extraordinary together.</p>
        </div>
        <div className="flex flex-col md:flex-row w-full justify-center gap-4">
            {contactItems.map((contactItem, i) => <div key={i} className="md:w-1/3 flex flex-col gap-4">
                <img src={contactItem.photo} className="w-full h-[100px] object-cover" ></img>
                <p className="text-2xl bg-mantle -mt-4 mb-4 p-2 text-center">{contactItem.title}</p>
                {contactItem.items.map((item, i) => <div key={i} className="flex flex-col gap-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-yellow">{item.designation}</p>
                    <p>{item.value}</p>
                    <Divider></Divider>
                </div>)}
            </div>)}

        </div>
    </Container>
}
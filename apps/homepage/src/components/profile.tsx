import { IconDefinition } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


type CardItem = { photo: string, name: string, designation: string, about: string, socials: { icon: IconDefinition, href: string }[], domains: string[], rollNo: string }

function ProfileCard(props: CardItem) {
  return <div className="flex flex-col px-4 py-8 w-full justify-around items-center bg-mantle text-center rounded h-[350px]">
      <img src={props.photo} className="w-20 object-contain rounded-full"></img>
      <p className="font-bold">{props.name}</p>
      <p className="text-yellow">{props.designation}</p>
      <p>{props.rollNo}</p>
      <p>{props.about}</p>
      <div className="flex gap-4">
          {props.domains.map((domain, i) => <span key={i} className="bg-crust rounded px-2 py-1 text-sm text-subtext0">{domain}</span>)}
      </div>
      <div className="flex gap-4">
          {props.socials.map((social, j) => <a href={social.href} key={j}><FontAwesomeIcon icon={social.icon} className="w-4 h-4 text-text"></FontAwesomeIcon>
          </a>)}
      </div>
  </div>
}

export default ProfileCard
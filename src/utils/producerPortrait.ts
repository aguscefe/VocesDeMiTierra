import type { ProducerProfile } from "../data/types";
// Reference images of the craft, not a claim about the identity of the model.
const references:Record<string,string>={ana:"foto-01",mateo:"foto-07",elena:"foto-09",lucia:"foto-10"};
export function producerPortrait(p:ProducerProfile){const key=Object.keys(references).find(k=>p.profile_image?.includes(`/demo/artesanos/${k}.png`));return key?{src:`/design/personas/${references[key]}.png`,reference:true}:{src:p.profile_image,reference:false};}

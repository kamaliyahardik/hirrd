import { ISectionTitle } from "@/types";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import AnimatedContent from "./AnimatedContent";

export default function SectionTitle({ icon, title, subtitle, dir = 'center' }: ISectionTitle) {
    return (
        <div className={`flex flex-col gap-6 ${dir === 'center' ? 'items-center text-center' : 'md:items-start items-center'}`}>
            <AnimatedContent className="flex flex-col md:flex-row items-center gap-4">
                <Button size="icon-sm">
                    <SparkleIcon className="w-6 h-6" />
                </Button>
                <h2 className="text-4xl font-semibold font-urbanist">{title}</h2>
            </AnimatedContent>
            <AnimatedContent>
                <p className={`text-zinc-500 text-base/7 ${dir === 'center' ? 'text-center max-w-lg' : 'md:text-left text-center max-w-sm'}`}>{subtitle}</p>
            </AnimatedContent>
        </div>
    )
}
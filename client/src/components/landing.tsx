/**
 * The Landing Component
 * 
 * This component is responsible for rendering the landing page of the application.
 * It includes the Entry and Secondary components.
 * Implements snap scrolling for the components.
 */

import Entry from "@/components/entry"
import Secondary from "@/components/secondary"

export default function Landing() {
	return (
		<div className="snap-y snap-mandatory overflow-y-scroll h-screen flex-grow z-0">
			<div className="snap-always snap-center" id="entry">
				<Entry />
			</div>
			<div className="snap-always snap-center flex justify-center pt-32" id="page-2">
				<div className="h-[80vh]">
					<Secondary />
				</div>
			</div>
		</div>
	)
}	
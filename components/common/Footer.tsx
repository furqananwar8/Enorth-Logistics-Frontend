import LegalPolicyModal from "../static/LegalPolicyModal"

export default function Footer() {
    return (
        <footer className="w-full border-t bg-muted/40 py-4">
            <div className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Enorth Logistics. All Rights Reserved.
                <LegalPolicyModal />
            </div>
        </footer>
    )
}
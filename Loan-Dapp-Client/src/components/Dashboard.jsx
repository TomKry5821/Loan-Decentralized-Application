import { Stack } from "@chakra-ui/react"
import CurrentTotals from "./CurrentTotals"
import LoanOptions from "./LoanOptions"

const Dashboard = () => {
    return (
        <Stack>
            <CurrentTotals />
            <LoanOptions />
        </Stack>
    )
}

export default Dashboard
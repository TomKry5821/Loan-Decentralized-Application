import { useForm } from 'react-hook-form'
import {
    FormErrorMessage,
    FormControl,
    Input,
    Button,
    Text,
    Flex
} from '@chakra-ui/react'
import { useContext } from 'react'
import { BlockchainContext } from '../context/BlockchainContext'

export default function PayInstallmentForm() {
    const { payInstallment, canTakeLoan, installmentAmount} = useContext(BlockchainContext)
    const {
        handleSubmit,
        register,
        formState: {isSubmitting },
    } = useForm()

    const onSubmit = async () => {
        console.log(JSON.stringify(installmentAmount, null, 2))
        const { payment } = installmentAmount;
        await payInstallment(payment)
    }

    return !canTakeLoan ? (
        <Flex justifyContent={'center'} alignItems={'center'} p={5} mt={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Text
                    fontFamily={'heading'}
                    fontSize={'x-large'}
                    fontWeight={600}
                    mb={4}>
                    Pay Installment
                </Text>
                <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                    Pay
                </Button>
            </form>
        </Flex>
    ) : (
        <>
        </>
    );
}
import { useForm } from 'react-hook-form'
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Text,
    Flex,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { BlockchainContext } from '../context/BlockchainContext'
import { useState } from 'react'

export default function TakeCustomLoanForm() {
    const { loanInterest, calculateLoanInterest, currentAccount, takeLoan } = useContext(BlockchainContext)
    const [loanAmount, setLoanAmount] = useState(5)
    const [installmentsNumber, setInstallmentsNumber] = useState(10)

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (values) => {
        const newValuesObject = { ...values }
        const { loanAmount, installmentsNumber } = newValuesObject
        setLoanAmount(loanAmount)
        setInstallmentsNumber(installmentsNumber)
        await calculateLoanInterest(loanAmount, installmentsNumber)
    }

    const submitLoan = async () => {
        await takeLoan(loanAmount, installmentsNumber, loanInterest)
    }


    return (
        <>
            <Text
                fontFamily={'heading'}
                fontSize={'x-large'}
                fontWeight={600}>
                Please fill loan amount and installment number in order to calculate loan interest.
            </Text>
            <Flex justifyContent={'center'} alignItems={'center'} p={5} mt={10}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl isInvalid={errors.loanAmount && errors.installmentsNumber}>
                        <FormLabel htmlFor='firstName'>Loan amount in ETH</FormLabel>
                        <Input
                            id='loanAmount'
                            type="number"
                            placeholder='Loan amount in ETH'
                            {...register('loanAmount', {
                                required: 'This is required',
                                min: { value: 0.1, message: 'Minimum value should be 0.1' }
                            })}
                        />
                        <FormErrorMessage>
                            {errors.loanAmount && errors.loanAmount.message}
                        </FormErrorMessage>
                        <FormLabel mt={5} htmlFor='installmentsNumber'>Installments number</FormLabel>
                        <Input
                            id='installmentsNumber'
                            type="number"
                            placeholder='Installments number'
                            {...register('installmentsNumber', {
                                required: 'This is required',
                                min: { value: 2, message: 'Minimum number should be 2' }
                            })}
                        />
                        <FormErrorMessage>
                            {errors.installmentsNumber && errors.installmentsNumber.message}
                        </FormErrorMessage>
                    </FormControl>
                    <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                        Calculate interest rate
                    </Button>
                    <Button mt={4} colorScheme='teal'
                        onClick={() => submitLoan()}
                    >
                        Take loan
                    </Button>
                </form>
            </Flex>
        </>
    )
}
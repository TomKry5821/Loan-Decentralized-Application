import { useForm } from 'react-hook-form'
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Text,
    Flex,
    Stack
} from '@chakra-ui/react'
import { useContext } from 'react'
import { BlockchainContext } from '../context/BlockchainContext'

export default function AddBorrowerForm() {
    const { addNewBorrower, currentAccount } = useContext(BlockchainContext)

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (values) => {
        const newValuesObject = { walletAddress: currentAccount, ...values }
        const { walletAddress, firstName, lastName } = newValuesObject
        await addNewBorrower(walletAddress, firstName, lastName)
    }

    return (
        <>
            <Stack>
                <Text
                    fontFamily={'heading'}
                    fontSize={'x-large'}
                    fontWeight={600}>
                    Please enter your first and last name to register as borrower.
                    <br></br>
                    Remember! You have to pay registration fee dependent on loan amount while taking the loan. In case of default in payment of fee installments non-refundably frozen
                </Text>
                <Flex justifyContent={'center'} alignItems={'center'} p={5} mt={10}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={errors.firstName && errors.lastName}>
                            <FormLabel htmlFor='firstName'>First Name</FormLabel>
                            <Input
                                id='firstName'
                                placeholder='First Name'
                                {...register('firstName', {
                                    required: 'This is required',
                                    minLength: { value: 4, message: 'Minimum length should be 4' }
                                })}
                            />
                            <FormErrorMessage>
                                {errors.firstName && errors.firstName.message}
                            </FormErrorMessage>
                            <FormLabel mt={5} htmlFor='lastName'>Last Name</FormLabel>
                            <Input
                                id='lastName'
                                placeholder='Last Name'
                                {...register('lastName', {
                                    required: 'This is required',
                                    minLength: { value: 4, message: 'Minimum length should be 4' }
                                })}
                            />
                            <FormErrorMessage>
                                {errors.lastName && errors.lastName.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                            Submit
                        </Button>
                    </form>
                </Flex>
            </Stack>
        </>
    )
}
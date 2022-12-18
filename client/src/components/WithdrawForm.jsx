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
export default function WithdrawForm() {
    const { withdraw } = useContext(BlockchainContext)
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (values) => {
        console.log(JSON.stringify(values, null, 2))
        const { creditbalance } = values;
        await withdraw(creditbalance);
    }

    return (
        <Flex justifyContent={'center'} alignItems={'center'} p={5} mt={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Text
                    fontFamily={'heading'}
                    fontSize={'x-large'}
                    fontWeight={600}
                    mb={4}>
                    Withdraw funds To Your Wallet
                </Text>
                <FormControl isInvalid={errors.creditbalance}>
                    <Input
                        id='creditbalance'
                        type="number"
                        step="any"
                        placeholder='Credit balance'
                        {...register('creditbalance', {
                            required: 'This is required'
                        })}
                    />
                    <FormErrorMessage>
                        {errors.creditbalance && errors.creditbalance.message}
                    </FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                    Withdraw
                </Button>
            </form>
        </Flex>
    )
}
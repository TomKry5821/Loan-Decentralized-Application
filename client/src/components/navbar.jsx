import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  RadioGroup,
  Radio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Tfoot

} from '@chakra-ui/react';
import { useContext, useState, useRef } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from "ethers"

export default function Navbar() {
  const { connectWallet, currentAccount, loanHistory } = useContext(BlockchainContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [scrollBehavior, setScrollBehavior] = useState('inside')

  const btnRef = useRef(null)


  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            LoanDapp
          </Text>

          <Flex display={{ md: 'flex' }} ml={10}>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {
            !!currentAccount &&
            <Button
              onClick={onOpen}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'blue.400'}
              href={'#'}
              _hover={{
                bg: 'blue.300',
              }}>
              Loans history
            </Button>
          }
          <Button
            onClick={connectWallet}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'blue.400'}
            href={'#'}
            _hover={{
              bg: 'blue.300',
            }}>
            {!currentAccount ? "Connect Wallet" : `${currentAccount.slice(0, 5)}...${currentAccount.slice(currentAccount.length - 4)}`}
          </Button>
        </Stack>
      </Flex>
      <>
        <Modal
          onClose={onClose}
          finalFocusRef={btnRef}
          isOpen={isOpen}
          scrollBehavior={scrollBehavior}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your loans history</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {
                !!loanHistory && loanHistory.map(loan => (
                  <TableContainer>
                    <Table variant='simple'>
                      <TableCaption>Loan stats</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>Information</Th>
                          <Th>Value</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Loan amount</Td>
                          <Td>{ethers.utils.formatEther(loan.loanAmount).toString()}ETH</Td>
                        </Tr>
                        <Tr>
                          <Td>Interest</Td>
                          <Td>{loan.interest.toString()}%</Td>
                        </Tr>
                        <Tr>
                          <Td>Installment number</Td>
                          <Td >{loan.installmentsNumber.toString()}</Td>
                        </Tr>
                        <Tr>
                          <Td>Loan start date</Td>
                          <Td >{new Date(loan.loanStartDate * 1000).toISOString().slice(0, 10)}</Td>
                        </Tr>
                        <Tr>
                          <Td>Active</Td>
                          <Td >{loan.isActive? "Yes" : "No"}</Td>
                        </Tr>
                      </Tbody>
                      <Tfoot>
                      </Tfoot>
                    </Table>
                  </TableContainer>
                ))
              }
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Box>

  );
}

const NAV_ITEMS = [];
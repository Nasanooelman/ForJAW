// Fill out your copyright notice in the Description page of Project Settings.


#include "PizzaBaser.h"

// Sets default values for this component's properties
UPizzaBaser::UPizzaBaser()
{
	// Set this component to be initialized when the game starts, and to be ticked every frame.  You can turn these features
	// off to improve performance if you don't need them.
	PrimaryComponentTick.bCanEverTick = true;

	// ...
}


// Called when the game starts
void UPizzaBaser::BeginPlay()
{
	Super::BeginPlay();

	// ...
	
}


// Called every frame
void UPizzaBaser::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	// ...
}

void UPizzaBaser::OnView()
{
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		PlayerClass->SetFocused("Pizza Baser");
	}
}

FString GetBase()
{
	return "Ketchup";
}


// The Pizza Baser is the first part of making a pizza.
// It generates the initial object and also selects which sauce base it has.
void UPizzaBaser::OnInteract()
{
	// Check if we have a Pizza already
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		// If they havent already got a pizza.
		if (PlayerClass->GetHeldPizza() == nullptr)
		{
			// This has to be deleted later.
			CPizza* newPizza = new CPizza();
			// This is the Baser so we need to add the selected Base
			newPizza->SetBase(GetBase());
			// Once Generated give the Pizza to the player
			PlayerClass->ReceivePizza(newPizza);

			UE_LOG(LogClass, Log, TEXT("RECEIVED PIZZA WITH A %s BASE"), *GetBase());
		}
		else
		{
			// TODO: MAKE REPORT ERROR
			UE_LOG(LogClass, Log, TEXT("YOU ALREADY HAVE A PIZZA"));
		}
	}
	else
	{
		UE_LOG(LogClass, Log, TEXT("ERROR 1: COULDN'T FIND PIZZA VARIABLE"));
	}


}


